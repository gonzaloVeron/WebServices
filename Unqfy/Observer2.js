const rp = require('request-promise');

class Observer2{
    /*constructor(){
        if(typeof Observer.instance === "object"){
            return Observer.instance;
        }

        Observer.instance = this;
        return this;
    }*/

    cambie(artistId, artistName, artistAlbumName){
        console.log("Entre en cambie")
        const options = {
            url: "http://localhost:6000/api/notify",
            body: { artistId : artistId, subject : artistName, message : artistAlbumName },
            json: true,
          };
        console.log("option !")
        rp.post(options).then(response => {
            console.log("Envie el mensajito, mostro");
        }).catch(err => console.log('Algo malio sal'));
    }
}

//const observer = new Observer()

module.exports = Observer2;