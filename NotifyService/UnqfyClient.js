const rp = require('request-promise');

class UnqfyClient{

    checkearExistenciaDeArtista(artistId){
        const options = {
            url: `http://localhost:7000/api/artists/${artistId}`,
            json: true,
        };
        return rp.get(options).then(response => {
                    return Promise.resolve(true)
                }).catch(err => Promise.resolve(false));
    }
}

module.exports = new UnqfyClient();

