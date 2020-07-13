const LogginBack = require('./LogginBack');

class LogginController{

    activate(req, res){
        LogginBack.activate();
        res.status(200);
        res.json();
    }

    desactivate(req, res){
        LogginBack.desactivate();
        res.status(200);
        res.json();
    }

    log(req, res){
        const message = req.body.message;
        const level = req.body.level;
        try{
            LogginBack.createLog(message, level);
        } catch(err) {
            res.status(404)
            res.json(err.message);
        }
        res.status(201);
        res.json();
    }

    isAlive(req, res){
        if(LogginBack._activated){
            res.status(200);
            res.json();
        } else {
            res.status(500);
            res.json();
        }
    }
}

module.exports = new LogginController();