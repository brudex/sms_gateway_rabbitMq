const logger = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const routes = require('./routes');
const workers = require('../app/workers');

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(compress());
  app.use(methodOverride());
  app.use('/api', routes);

  // workers.forEach(function (worker) {
  //   worker.execute();
  // });

  app.use((req, res, next) => {
    const statistics = [];
    for(let k=0,len=workers.length;k<len;k++){
      statistics.push(workers[k].getStats());
    }
    res.json(statistics);
  });

  // Send Stats Json
  app.use((err, req, res, next) => {
    res.status(err.status || 200);
    const statistics = [];
    for(let k=0,len=workers.length;k<len;k++){
      statistics.push(workers[k].getStats());
    }
    res.json(statistics);
  });

  return app;
};
