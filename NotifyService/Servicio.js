const rp = require('request-promise');

function checkearExistenciaDeArtista(artistId){
    const options = {
        url: `/api/artists/${artistId}`,
        json: true,
      };
    return rp.get(options).then(response => {
        return true
    }).catch(err => false);
   
}

module.exports = { checkearExistenciaDeArtista }