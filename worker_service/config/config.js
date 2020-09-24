const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'nodeapp'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/nodeapp-development',
    rabbitmq : 'amqp://localhost'
  },
  test: {
    root: rootPath,
    app: {
      name: 'nodeapp'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://mongo/nodeapp-test',
    rabbitmq : 'amqp://localhost'
  },
  production: {
    root: rootPath,
    app: {
      name: 'nodeapp'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://mongo:27017/nodeapp', //docker service name is mongo,
    rabbitmq : 'amqp://localhost'
  }
};

module.exports = config[env];
