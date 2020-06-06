const UnqfyController = require('./UnqfyController');

class AlbumController extends UnqfyController{

  addAlbum(req, res) {
    const unqfy =  this.getUNQfy();
    try{
      const album = unqfy.addAlbum(req.body.artistId, {name: req.body.name, year: req.body.year});
      this.saveUNQfy(unqfy);
      res.status(201);
      res.json(album.toJSON());
    } catch (err) {
      res.status(404);
      res.json({
        status: 404,
        errorCode: 'RELATED_RESOURCE_NOT_FOUND'
      });
    }
    
  }

  getAlbumById(req, res) {
    const unqfy =  this.getUNQfy();
    try {
      const album = unqfy.getAlbumById(req.params.id);
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
    const unqfy =  this.getUNQfy();
    try {
      const album = unqfy.updateAlbumById(req.params.id, req.body);
      this.saveUNQfy(unqfy);
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
    const unqfy =  this.getUNQfy();
    try {
      unqfy.removeAlbum(req.params.id);
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

  searchAlbum(req, res) {
    const unqfy =  this.getUNQfy();
    const name = req.query.name;
    const albums = unqfy.searchByName(name).albums;
    res.status(200);
    res.json(albums.map(a => a.toJSON()));
  }

}
module.exports = {
  AlbumController
};