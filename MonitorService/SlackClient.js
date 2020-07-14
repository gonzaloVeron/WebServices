const rp = require("request-promise");

const TOKEN = "euwIrXBgyq5cFSr70jS1rnHE";

class SlackClient{

    postMessage(message){
        const options = {
            url: "https://hooks.slack.com/services/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",
            body: {
                text: message,
            },
            json: true,
        };
        rp.post(options).then(response => {
            console.log("envie el mensaje mostro");
        }).catch(err => {
            console.log("algo malio sal");
        });
    }
}

module.exports = new SlackClient();