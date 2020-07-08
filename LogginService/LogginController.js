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
        const fileName = req.body.fileName;
        try{
            LogginBack.createLog(fileName, message, level);
        } catch(err) {
            
        }
        res.status(201);
        res.json();
    }
}

module.exports = new LogginController();