const rp = require("request-promise");
const SlackClient = require("./SlackClient");

class MonitorBack{

    constructor(){
        this._activated = false;
        this._unqfyAlive = true;
        this._notifyAlive = true;
        this._logginAlive = true;
    }

    activate(){
        this._activated = true;
    }

    desactivate(){
        this._activated = false;
    }

    monitoreoPeriodico(){
        if(this._activated){
            this.unqfyIsAlive();
            this.logginIsAlive();
            this.notifyIsAlive();
            setTimeout(() => {this.monitoreoPeriodico()}, 60000)
        }
    }

    unqfyIsAlive(){
        const options = {
            url: "http://172.20.0.21:7000/api/isAlive",
            json: true,
        };
        rp.get(options).then(response => {
            if(!this._unqfyAlive){
                SlackClient.postMessage(new Date().toLocaleTimeString() + " El servicio Unqfy ha vuelto a funcionar")
                this._unqfyAlive = true
            } else {
                console.log("Esta vivo");
            }
        }).catch(err => {
            if(this._unqfyAlive){
                SlackClient.postMessage(new Date().toLocaleTimeString() + " El servicio Unqfy ha dejado de funcionar")
            }
            this._unqfyAlive = false
        });
    }

    logginIsAlive(){
        const options = {
            url: "http://172.20.0.23:5000/api/isAlive",
            json: true,
        };
        rp.get(options).then(response => {
            if(!this._logginAlive){
                SlackClient.postMessage(new Date().toLocaleTimeString() + " El servicio Loggin ha vuelto a funcionar")
                this._logginAlive = true
            } else {
                console.log("Esta vivo");
            }
        }).catch(err => {
            if(this._logginAlive){
                SlackClient.postMessage(new Date().toLocaleTimeString() + " El servicio Loggin ha dejado de funcionar")
            }
            this._logginAlive = false
        });
    }

    notifyIsAlive(){
        const options = {
            url: "http://172.20.0.22:3000/api/isAlive",
            json: true,
        };
        rp.get(options).then(response => {
            if(!this._notifyAlive){
                SlackClient.postMessage(new Date().toLocaleTimeString() + " El servicio Notify ha vuelto a funcionar")
                this._notifyAlive = true
            } else {
                console.log("Esta vivo");
            }
        }).catch(err => {
            if(this._notifyAlive){
                SlackClient.postMessage(new Date().toLocaleTimeString() + " El servicio Notify ha dejado de funcionar")
            }
            this._notifyAlive = false
        });
    }

}

module.exports = new MonitorBack();