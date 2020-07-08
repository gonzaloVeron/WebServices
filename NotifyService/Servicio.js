const rp = require('request-promise');
const NonExistentException = require('./NonExistentException');

module.exports = { 
    checkearExistenciaDeArtista : function(artistId){
        const options = {
            url: `http://localhost:7000/api/artists/${artistId}`,
            json: true,
        };
        return rp.get(options).then(response => {
            //console.log(response)
            return response !== undefined
        }).catch(err => { throw new NonExistentException() });
    } 
}

