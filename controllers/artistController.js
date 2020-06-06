const UnqfyController = require('./UnqfyController');

class ArtistController extends UnqfyController{

  searchArtist(req, res) {
    const unqfy =  this.getUNQfy();
    const name = req.query.name;
    const artists = unqfy.searchByName(name).artists;
    res.status(200);
    res.json(artists.map(a => a.toJSON()));
  }

  getArtistById(req, res) {
    const id = req.params.id;
    const unqfy =  this.getUNQfy();
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
    const unqfy =  this.getUNQfy();
    const id = req.params.id;
    try {
      const artist = unqfy.updateArtistById(id, req.body);
      this.saveUNQfy(unqfy);
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
    const unqfy =  this.getUNQfy();
    try {
      unqfy.removeArtist(req.params.id);
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

  addArtist(req, res) {
    const unqfy =  this.getUNQfy();
    try{
      const artist = unqfy.addArtist(req.body);
      this.saveUNQfy(unqfy);
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

module.exports = {
  ArtistController
};