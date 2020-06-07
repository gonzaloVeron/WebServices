const UnqfyController = require('./UnqfyController');

class TrackController {

  getLyrics(req, res) {
    const unqfy =  UnqfyController.getUNQfy();
    try {
      const track = unqfy.getTrackById(parseInt(req.params.id));
      track.getLyrics().then( _ => {
        UnqfyController.saveUNQfy(unqfy);
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

module.exports = new TrackController();
