const UnqfyController = require('./UnqfyController');
const errores = require('../Exceptions/APIError');
const ExistException = require('../ExistException');

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
      throw new errores.ResourceNotFound();
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
      throw new errores.ResourceNotFound();
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
      throw new errores.ResourceNotFound();
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
      if(err instanceof ExistException){
        throw new errores.ResourseAlreadyExists();
      } else {
        throw new errores.BadRequest(); 
      }
    }
  }

}

module.exports = new ArtistController();