const fs = require('fs'); 
const unqmod = require('../unqfy'); 

class UnqfyController {
  getUNQfy(filename = 'data.json') {
    let unqfy = new unqmod.UNQfy();
    if (fs.existsSync(filename)) {
      unqfy = unqmod.UNQfy.load(filename);
    }
    return unqfy;
  }
      
  saveUNQfy(unqfy, filename = 'data.json') {
    unqfy.save(filename);
  }

}
module.exports = UnqfyController;