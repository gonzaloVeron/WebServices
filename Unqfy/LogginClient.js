const rp = require('request-promise');

class LogginClient{

    log(level, message){
        const options = {
            url: `http://localhost:5000/api/log`,
            body: {
                "level": level,
                "message": message
            },
            json: true,
        };
        return rp.post(options).then(response => {
                    console.log("pude mandar el log mostro")
                }).catch(err => {
                    console.log("algo malio sal")
                });
    }
}

module.exports = new LogginClient();