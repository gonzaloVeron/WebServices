const UnqfyController = require('./UnqfyController');
const NonExistentException = require('../NonExistentException');
const errores = require('../Exceptions/APIError');

class TrackController {

  getLyrics(req, res) {
    const unqfy =  UnqfyController.getUNQfy();
    try {
      const track = unqfy.getTrackById(parseInt(req.params.id));
      track.getLyrics().then( () => {
        UnqfyController.saveUNQfy(unqfy);
        res.status(200);
        res.json(track.toJSON());
      });
    } catch(err){
      throw new errores.ResourceNotFound();
    }
  }

  addTrack(req, res){
    const unqfy = UnqfyController.getUNQfy();
    try{
      const track = unqfy.addTrack(parseInt(req.params.id), req.body);
      UnqfyController.saveUNQfy(unqfy);
      res.status(201);
      res.json(track.toJSON());
    } catch (err) {
      if (err instanceof NonExistentException){
        throw new errores.RelatedResourceNotFound();
      } else{
        throw new errores.BadRequest();
      }
    }
  }

}

module.exports = new TrackController();
