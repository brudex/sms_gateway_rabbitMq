## Building a Bulk sms gateway with Rabbitmq.

Recently a developer in one of the financial institutions called me about any strategies for managing their bulk sms gateway which was having delays in delivering to customers. Their strategy was inserting into an sql table and having a job pick and send the messages. This is a common anti-pattern adopted by many enterprises for handling this types of scenarios related to fire and forget architectures. The biggest problem with this design is it does scale becuase you can only have one job runing sending the messsages. If by some voodoo coding you get it to scale you have handle your own process synchronization so a single message is not processed by multiple jobs. As if that is not enough you once you get synchronization working the processing of each job slows down. 

 Enter RabbitMq, rabbitmq is an open source message broker software that implements the Advanced Message Queuing Protocol (AMQP). Rabbitmq is ligtweight easy to deploy on premise and in the cloud. You can read more about rabbitmq [here](https://www.rabbitmq.com/tutorials/)

### Why use RabbitMq?
Now that you know what RabbitMQ is, the next question is: why should you use a queue instead queue in a database and processing with a job. There are a couple of reasons why using a queue instead of directly sending data is better:

- Higher availability and better error handling. You can requeue a message if sending fails
- Better scalability: You can run multiple instances of a job without worry about duplicate processing
- Asynchronous message processing.

Let begin building our service.

### Architecture

![Image](architecture.png)

The above show the design of our sms gateway. In the above service our web api receives all requests and forwards theme to our message queue(rabbitmq). Since all this api is doing is forwarding messages it has a high throughput and can gracefully handle as about 10 requests per second running a single instance. In future when this api reaches its threshhold we can run multiple instances in a docker swarm or use a software load balancer like [pm2](https://pm2.keymetrics.io/) to handle the proverbial 100 requests per second.

The processing of requests is handled by workers consuming requests from rabbitmq. Each worker is a nodejs process. The nodejs processes are run in a cluster using pm2. Although we are using nodejs here rabbitmq has client libraries for java,c#,python etc. You can write worker services in any of these languages to consume messages in rabbitmq.

### Setting up RabbitMq
Setting up rabbitmq is easy. RabbitMq runs on Erlang so you have to install an Erlang runtime before install RabbitMq. You can follow this to install rabbitMq locally or on a server. However if you have docker you are ninja and for us ninjas we can install and setup rabbitmq with just one command.

```yaml
docker run -d -p 15672:15672 -p 5672:5672 --name brudexRabbit rabbitmq:3-management
```

This will pull the rabbitmq image if not available and run it with the default ports. For those of you still wondering brudexRabbit is the name am giving to this container.

### Consuming Messages in the Worker Process
The below code demonstrates consuming the `sms_messages` queue in rabbitmq. In the `Worker.execute` method we call the `doWork` function which sends the sms messages by calling `controller.sendSms`. Though not implemented in this tutorial the `controller.sendSms` will in turn call an sms provider like Infobip, Twilio, or Plivo to send the sms. The above architecture sends sms to three providers. In high availability environments like banks and other finanical systems its very important to have more than one sms provider to swith between them when one service provider goes down.

***Code to consume the sms queue***
```javascript
const Worker = {};
const queue = 'sms_messages';
const amqp = require('amqplib/callback_api');
const controller = require('../controllers/smsmessage_controller');

function doWork(rawData){
  if(rawData) {
    try{
      let json = JSON.parse(rawData);
      controller.sendSms(json);
    }catch(e){
      console.log(`There was an error in queue ${queue}>> `,e);
     }
  }
}

Worker.execute = function(){
  amqp.connect(config.rabbitmq, function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(queue, {
        durable: false
      });
       channel.consume(queue, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
        doWork(msg.content.toString());
        const now = Math.round(new Date().getTime() / 1000);
        stats.uptime = now - startupTime;
      }, {
           noAck: true
      });
    });
  });
};
```

### Publising/Sending Messages to RabbitMq
Sending message to the queue will be done by a web api written in any language. RabbitMq has sdks for all the popuplar languages including rust except the V programming language which by the way I don't know who is using that. In this post we demonstrate how to send messages using C# assuming is a netcore application. For those of you still using .Net framework I don't how archaic you can be but switch to netcore now.

***Code to send messages to the sms queue***
```csharp
    public class SmsMessage
    {
        public string mobile { get; set; }
        public string sender { get; set; }
        public string message { get; set; }
        public string appId { get; set; }
        public string reference { get; set; }

    }
    public class SmsConsumer
    {

        public SmsConsumer()
        {
            _factory = new ConnectionFactory() { HostName = "localhost" };
        }
        private static ConnectionFactory _factory;
        private static IConnection _connection;
        private const string QueueName = "sms_messages";

        public  void ProcessMessages()
        {
            using (_connection = _factory.CreateConnection())
            {
                using (var channel = _connection.CreateModel())
                {
                    channel.QueueDeclare(queue: QueueName,
                                 durable: false,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

                    var smsMessage = new SmsMessage { appId = "DefaultApp", mobile = "233246583910",
                        message = "Call Me Back", sender = "Brudex:Yours Truly", reference = "sms-123-987-098" };

                    string message = JsonConvert.SerializeObject(smsMessage);
                    var body = Encoding.UTF8.GetBytes(message);

                    channel.BasicPublish(exchange: "",
                                         routingKey: "",
                                         basicProperties: null,
                                         body: body);

                }
            }
        }
    }

```
