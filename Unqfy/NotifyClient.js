const rp = require('request-promise');

class NotifyClient{

    notify(artistId, artistName, artistAlbumName){
        const options = {
            url: "http://172.20.0.22:3000/api/notify",
            body: { artistId : artistId, subject : `Nuevo album para ${artistName} !`, message : `Se ha agregado el album ${artistAlbumName}` },
            json: true,
          };
        rp.post(options).then(response => {
            console.log("Envie el mensajito, mostro");
        }).catch(err => console.log('Algo malio sal en NotifyClient'));
    }
}

module.exports = NotifyClient;