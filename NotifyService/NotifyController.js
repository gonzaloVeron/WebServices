const fs = require('fs'); 
const unqmod = require('./NotifyBack'); 

class NotifyController {

  static getNotify(filename = 'data.json') {
    let notify = new unqmod.NotifyBack();
    if (fs.existsSync(filename)) {
        notify = unqmod.NotifyBack.load(filename);
    }
    return notify;
  }
      
  static saveNotify(notify, filename = 'data.json') {
    notify.save(filename);
  }

}

module.exports = NotifyController;