const rp = require('request-promise');

class Observer2{

    cambie(artistId, artistName, artistAlbumName){
        const options = {
            url: "http://localhost:6000/api/notify",
            body: { artistId : artistId, subject : `Nuevo album para ${artistName} !`, message : `Se ha agregado el album ${artistAlbumName}` },
            json: true,
          };
        rp.post(options).then(response => {
            console.log("Envie el mensajito, mostro");
        }).catch(err => console.log('Algo malio sal'));
    }
}

module.exports = Observer2;