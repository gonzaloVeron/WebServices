const fs = require('fs'); // para cargar/guarfar unqfy
const LogglyClient = require('./LogglyClient');

const messageLevel = {
    WARNING: 'warning',
    INFO: 'info',
    DEBUG: 'debug',
    ERROR: 'error'
}

class LogginBack{

    constructor(){
        this._activated = true;
    }

    createLog(message, level){
        const date = new Date().toLocaleDateString().replace("/", "-").replace("/", "-");
        const time = new Date().toLocaleTimeString().replace(":", "-").replace(":", "-");
        const fileName = date + "-" + time
        if(this._activated){
            fs.writeFileSync(`./logs/${fileName}.txt`, JSON.stringify({message, level}));
            LogglyClient.log(level, message);
        } else {
            throw new Error("Sistema desactivado");
        }
    }

    activate(){
        this._activated = true;
    }
    desactivate(){
        this._activated = false;
    }
}

module.exports = new LogginBack();