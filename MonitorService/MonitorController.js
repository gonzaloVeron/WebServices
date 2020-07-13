const MonitorBack = require('./MonitorBack');

class MonitorController{

    activate(req, res){
        MonitorBack.activate().then(() =>{
            MonitorBack.monitoreoPeriodico();
        });
        res.status(200);
        res.json();
    }

    desactivate(req, res){
        MonitorBack.desactivate();
        res.status(200);
        res.json();
    }

    unqfyIsAlive(req, res){
        MonitorBack.unqfyIsAlive();
        res.status(200);
        res.json();
    }

    logginIsAlive(req, res){
        MonitorBack.logginIsAlive();
        res.status(200);
        res.json();
    }

    notifyIsAlive(req, res){
        MonitorBack.notifyIsAlive();
        res.status(200);
        res.json();
    }
}

module.exports = new MonitorController();