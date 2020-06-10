const UnqfyController = require('./UnqfyController');
const NonExistentException = require('../NonExistentException');
const ExistException = require('../ExistException');
const errores = require('../Exceptions/APIError');

class AlbumController {

  addAlbum(req, res) {
    const unqfy =  UnqfyController.getUNQfy();
    try{
      const album = unqfy.addAlbum(parseInt(req.body.artistId), {name: req.body.name, year: req.body.year});
      UnqfyController.saveUNQfy(unqfy);
      res.status(201);
      res.json(album.toJSON());
    } catch (err) {
      if(err instanceof NonExistentException){
        throw new errores.RelatedResourceNotFound();
      } else if (err instanceof ExistException){
        throw new errores.ResourseAlreadyExists();
      } else{
        throw new errores.BadRequest();
      }
    } 
    
  }

  getAlbumById(req, res) {
    const unqfy =  UnqfyController.getUNQfy();
    try {
      const album = unqfy.getAlbumById(parseInt(req.params.id));
      res.status(200);
      res.json(album.toJSON());
    } catch (err){
      throw new errores.ResourceNotFound();
    }
  }

  updateAlbum(req, res) {
    const unqfy =  UnqfyController.getUNQfy();
    try {
      const album = unqfy.updateAlbumById(parseInt(req.params.id), req.body);
      UnqfyController.saveUNQfy(unqfy);
      res.status(200);
      res.json(album.toJSON());
    } catch (err){
      throw new errores.ResourceNotFound();
    }
  }

  deleteAlbum(req, res) {
    const unqfy =  UnqfyController.getUNQfy();
    try {
      unqfy.removeAlbum(parseInt(req.params.id));
      UnqfyController.saveUNQfy(unqfy);
      res.status(204);
      res.json();
    } catch(err){
      throw new errores.ResourceNotFound();
    }
    
  }

  searchAlbum(req, res) {
    const unqfy =  UnqfyController.getUNQfy();
    const name = req.query.name;
    let albums = [];
    if (name === undefined){
      albums = unqfy.albums();
    }else {
      albums = unqfy.searchByName(name).albums;
    }
    res.status(200);
    res.json(albums.map(a => a.toJSON()));
  }

}

module.exports = new AlbumController();