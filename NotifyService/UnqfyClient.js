const rp = require('request-promise');
const MissingDataException = require('./MissingDataException');

class UnqfyClient{

    checkearExistenciaDeArtista(artistId){
        const options = {
            url: `http://localhost:7000/api/artists/${artistId}`,
            json: true,
        };
        return this.verifyArtistId(artistId).then((id) => {
            return rp.get(options).then(response => {
                return Promise.resolve(true)
            }).catch(err => { Promise.resolve(false) });
        })
    }

    verifyArtistId(artistId){
        return new Promise((resolve, reject) => {
            if(isNaN(artistId)){
                throw new MissingDataException();
            }
            resolve(artistId);
        }).catch(err => Promise.reject(err));
    }
}

module.exports = new UnqfyClient();

