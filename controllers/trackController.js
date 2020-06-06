const UnqfyController = require('./UnqfyController');

class TrackController extends UnqfyController{

  getLyrics(req, res) {
    const unqfy =  this.getUNQfy();
    try {
      const track = unqfy.getTrackById(req.params.id);
      track.getLyrics().then( _ => {
        this.saveUNQfy(unqfy);
        res.status(200);
        res.json(track.toJSON());
      });
    } catch(err){
      res.status(404);
      res.json({
        status: 404,
        errorCode: 'RESOURCE_NOT_FOUND'
      });
    }
  }

}

module.exports = {
  TrackController
};
