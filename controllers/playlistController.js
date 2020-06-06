const UnqfyController = require('./UnqfyController');

class PlaylistController extends UnqfyController{

  createPlaylist(req, res) {
    const unqfy =  this.getUNQfy();
    try {
      const playList = unqfy.createPlaylist(req.body.name, req.body.genres, req.body.maxDuration);
      this.saveUNQfy(unqfy);
      res.status(201);
      res.json(playList.toJSON());
    } catch (err){
      res.status(404);
      res.json({
        status: 404,
        errorCode: 'RELATED_RESOURCE_NOT_FOUND'
      });
    }
  }

  getPlaylistById(req, res) {
    const unqfy =  this.getUNQfy();
    try {
      const playList = unqfy.getPlaylistById(req.params.id);
      res.status(200);
      res.json(playList.toJSON());
    } catch (err){
      res.status(404);
      res.json({
        status: 404,
        errorCode: 'RESOURCE_NOT_FOUND'
      });
    }
  }

  deletePlaylistById(req, res) {
    const unqfy =  this.getUNQfy();
    try {
      unqfy.removePlayList(req.params.id);
      this.saveUNQfy(unqfy);
      res.status(204);
      res.json();
    } catch(err){
      res.status(404);
      res.json({
        status: 404,
        errorCode: 'RESOURCE_NOT_FOUND'
      });
    }
  }

  searchPlaylist(req, res) {
    const unqfy =  this.getUNQfy();
    let playLists = unqfy.playLists;
    const name = req.query.name;
    const durationLT = req.query.durationLT;
    const durationGT = req.query.durationGT;
    if(name !== undefined){
      playLists = playLists.filter(p => p.name.contains(name));
    }
    if(durationLT !== undefined){
      playLists = playLists.filter(p => p.duration() < durationLT);
    }
    if(durationGT !== undefined){
      playLists = playLists.filter(p => p.duration() > durationGT);
    }

    playLists.filter(p => p);
    res.status(200);
    res.json(playLists.map(p => p.toJSON()));
  }

}
module.exports = {
  PlaylistController
};
