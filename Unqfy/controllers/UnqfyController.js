const fs = require('fs'); 
const unqmod = require('../unqfy'); 

class UnqfyController {

  static getUNQfy(filename = 'data.json') {
    let unqfy = new unqmod.UNQfy();
    if (fs.existsSync(filename)) {
      unqfy = unqmod.UNQfy.load(filename);
    }
    return unqfy;
  }
      
  static saveUNQfy(unqfy, filename = 'data.json') {
    unqfy.save(filename);
  }

  static isAlive(req, res){
    res.status(200);
    res.json();
  }

}

module.exports = UnqfyController;