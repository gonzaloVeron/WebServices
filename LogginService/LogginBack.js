const fs = require('fs'); // para cargar/guarfar unqfy

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

    createLog(fileName, message, level){
        if(this._activated){
            fs.writeFileSync(fileName, JSON.stringify({message, level}));
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