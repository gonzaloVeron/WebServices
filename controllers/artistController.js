const UnqfyController = require('./UnqfyController');

class ArtistController {

  searchArtist(req, res) {
    const unqfy =  UnqfyController.getUNQfy();
    const name = req.query.name;
    let artists = [];
    if (name === undefined){
      artists = unqfy.artists;
    }else {
      artists = unqfy.searchByName(name).artists;
    }
    res.status(200);
    res.json(artists.map(a => a.toJSON()));
  }

  getArtistById(req, res) {
    const id = parseInt(req.params.id);
    const unqfy =  UnqfyController.getUNQfy();
    try {
      const artist = unqfy.getArtistById(id);
      res.status(200);
      res.json(artist.toJSON());
    } catch(err){
      res.status(404);
      res.json({
        status: 404,
        errorCode: 'RESOURCE_NOT_FOUND'
      });
    }
  }

  updateArtistById(req, res) {
    const unqfy =  UnqfyController.getUNQfy();
    const id = parseInt(req.params.id);
    try {
      const artist = unqfy.updateArtistById(id, req.body);
      UnqfyController.saveUNQfy(unqfy);
      res.status(200);
      res.json(artist.toJSON());
    } catch(err){
      res.status(404);
      res.json({
        status: 404,
        errorCode: 'RESOURCE_NOT_FOUND'
      });
    }
  }

  deleteArtistById(req, res) {
    const unqfy =  UnqfyController.getUNQfy();
    try {
      unqfy.removeArtist(parseInt(req.params.id));
      UnqfyController.saveUNQfy(unqfy);
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

  addArtist(req, res) {
    const unqfy = UnqfyController.getUNQfy();
    try{
      const artist = unqfy.addArtist(req.body);
      UnqfyController.saveUNQfy(unqfy);
      res.status(201);
      res.json(artist.toJSON());
    } catch (err){
      res.status(409);
      res.json({
        status: 409,
        errorCode: 'RESOURCE_ALREADY_EXISTS'
      });
    }
    
  }

}

module.exports = new ArtistController();