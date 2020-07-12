var winston  = require('winston');
var {Loggly} = require('winston-loggly-bulk');

class LogglyClient{

    log(level, message){
        winston.add(new Loggly({
            token: "c7234463-f197-4367-86e4-79216d866754",
            subdomain: "https://firulais.loggly.com",
            tags: ["Winston-NodeJS"],
            json: true
        }));
        winston.log(level, message);
    }
}

module.exports = new LogglyClient();