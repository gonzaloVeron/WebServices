const UnqfyController = require('./UnqfyController');
const ExistException = require('../ExistException');
const NonExistentException = require('../NonExistentException');
const errores = require('../Exceptions/APIError');

class UserController {

  addUser(req, res) {
    const unqfy = UnqfyController.getUNQfy();
    try{
      const user = unqfy.addUser(req.body.name);
      UnqfyController.saveUNQfy(unqfy);
      res.status(201);
      res.json(user.toJSON());
    } catch (err) {
      if (err instanceof ExistException){
        throw new errores.ResourseAlreadyExists();
      } else{
        throw new errores.BadRequest();
      }
    }  
  }

  updateUser(req, res){
    const unqfy = UnqfyController.getUNQfy();
    try{
      const user = unqfy.updateUserById(parseInt(req.params.id), req.body.name);
      UnqfyController.saveUNQfy(unqfy);
      res.status(200);
      res.json(user.toJSON());
    } catch (err) {
      if(err instanceof NonExistentException){
        throw new errores.ResourceNotFound();
      } else if (err instanceof ExistException){
        throw new errores.ResourseAlreadyExists();
      } else{
        throw new errores.BadRequest();
      }
    }  
  }

  deleteUser(req, res){
    const unqfy = UnqfyController.getUNQfy();
    unqfy.removeUser(parseInt(req.params.id));
    UnqfyController.saveUNQfy(unqfy);
    res.status(204);
    res.json();
  }

  getUserById(req, res){
    const unqfy = UnqfyController.getUNQfy();
    const user = unqfy.getUserById(parseInt(req.params.id));
    if(user === undefined){
      throw new errores.ResourceNotFound();
    }
    UnqfyController.saveUNQfy(unqfy);
    res.status(200);
    res.json(user.toJSON());
  }

  getTimesHeard(req, res){
    const unqfy = UnqfyController.getUNQfy();
    try{
      const times = unqfy.timesHeard(parseInt(req.params.userId), parseInt(req.params.trackId));
      const response = {timesHeard: times};
      UnqfyController.saveUNQfy(unqfy);
      res.status(200);
      res.json(response);
    }catch(err){
      throw new errores.ResourceNotFound();
    }
  }

  getMostHeard(req, res){
    const unqfy = UnqfyController.getUNQfy();
    try{
      const objList = unqfy.mostHeard(parseInt(req.params.userId), parseInt(req.params.artistId));
      const response = {mostHeardTracks: objList};
      UnqfyController.saveUNQfy(unqfy);
      res.status(200);
      res.json(response);
    }catch(err){
      throw new errores.ResourceNotFound();
    }
  }

  hear(req, res){
    const unqfy = UnqfyController.getUNQfy();
    try{
      unqfy.hear(parseInt(req.params.userId), parseInt(req.params.trackId));
      UnqfyController.saveUNQfy(unqfy);
      res.status(200);
      res.json();
    }catch(err){
      throw new errores.ResourceNotFound();
    }
  }

}

module.exports = new UserController();