const errores = require('./APIError');
const NonExistentException = require('./NonExistentException');
const NotifyController = require('./NotifyController')

class SubscriptionController {

  subscribe(req, res) {
    const artistId = parseInt(req.body.artistId);
    const email = req.body.email;
    let notify = NotifyController.getNotify()
    try{
        notify.subscribe(email, artistId);
    }catch(err){
        if(err instanceof NonExistentException){
            throw new errores.ResourceNotFound();
        } else {
            throw new errores.BadRequest(); 
        }
    }
    NotifyController.saveNotify(notify);
    res.status(200);
    res.json();
  }

  unsuscribe(req, res){
    const artistId = parseInt(req.body.artistId);
    const email = req.body.email;
    let notify = NotifyController.getNotify()
    try{
        notify.unsubscribe(email, artistId);

    }catch(err){
        if(err instanceof NonExistentException){
            throw new errores.ResourceNotFound();
        } else {
            throw new errores.BadRequest(); 
        }
    }
    NotifyController.saveNotify(notify);
    res.status(200);
    res.json();
  }

  notify(req, res){
    const artistId = parseInt(req.body.artistId);
    const subject = req.body.subject;
    const message = req.body.message;
    let notify = NotifyController.getNotify()
    try{
        notify.notify(artistId, subject, message);

    }catch(err){
        if(err instanceof NonExistentException){
            throw new errores.ResourceNotFound();
        } else {
            throw new errores.BadRequest(); 
        }
    }
    res.status(200);
    res.json();
  }

  getSubscriptionsByArtistId(req, res, next){
    const artistId = parseInt(req.query.artistId);
    let notify = NotifyController.getNotify()

    notify.subscriptions(artistId).then((emails) => {
        res.status(200);
        res.json({
            "artistId": artistId,
            "subscriptors": emails
        });
    }).catch(err => {
        if(err instanceof NonExistentException){
            next(new errores.ResourceNotFound());
        } else {
            next(new errores.BadRequest());
        }
    });
  }

  deleteSubscriptionsByArtistId(req, res){
    const artistId = parseInt(req.body.artistId);
    let notify = NotifyController.getNotify()
    try{
        notify.deleteSubscriptions(artistId);

    }catch(err){
        if(err instanceof NonExistentException){
            throw new errores.ResourceNotFound();
        } else {
            throw new errores.BadRequest(); 
        }
    }
    NotifyController.saveNotify(notify);
    res.status(200);
    res.json();
  }

}

module.exports = new SubscriptionController();