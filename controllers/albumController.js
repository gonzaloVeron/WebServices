const UnqfyController = require('./UnqfyController');
const NonExistentException = require('../NonExistentException');
const ExistException = require('../ExistException');

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
        res.status(404);
        res.json({
          status: 404,
          errorCode: 'RELATED_RESOURCE_NOT_FOUND'
        });
      } else if (err instanceof ExistException){
        res.status(409);
        res.json({
          status:409,
          errorCode: 'RESOURCE_ALREADY_EXISTS'
        });
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
      res.status(404);
      res.json({
        status: 404,
        errorCode: 'RESOURCE_NOT_FOUND'
      });
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
      res.status(404);
      res.json({
        status: 404,
        errorCode: 'RESOURCE_NOT_FOUND'
      });
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
      res.status(404);
      res.json({
        status: 404,
        errorCode: 'RESOURCE_NOT_FOUND'
      });
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