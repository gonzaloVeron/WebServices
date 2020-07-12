const errores = require('./APIError');
const NonExistentException = require('./NonExistentException');
const NotifyController = require('./NotifyController')

class SubscriptionController {

  subscribe(req, res, next) {
    const artistId = parseInt(req.body.artistId);
    const email = req.body.email;

    let notify = NotifyController.getNotify();
    notify.subscribe(email, artistId).then((service) => {
        
        NotifyController.saveNotify(service);
        
        res.status(200);
        res.json();

    }).catch(err => {
        if(err instanceof NonExistentException){
            next(new errores.ResourceNotFound());
        } else {
            next(new errores.BadRequest());
        }
    });
  }

  unsubscribe(req, res, next){
    const artistId = parseInt(req.body.artistId);
    const email = req.body.email;

    let notify = NotifyController.getNotify();
    notify.unsubscribe(email, artistId).then((service) => {
        
        NotifyController.saveNotify(service);
        
        res.status(200);
        res.json();

    }).catch(err => {
        if(err instanceof NonExistentException){
            next(new errores.ResourceNotFound());
        } else {
            next(new errores.BadRequest()); 
        }
    });
    
  }

  notify(req, res, next){
    const artistId = parseInt(req.body.artistId);
    const subject = req.body.subject;
    const message = req.body.message;
    let notify = NotifyController.getNotify();

    notify.notify(artistId, subject, message).then(() => {
    
        res.status(200);
        res.json();
    }).catch(err => {
        if(err instanceof NonExistentException){
            next(new errores.ResourceNotFound());
        } else {
            next(new errores.BadRequest()); 
        }
    });
  }

  getSubscriptionsByArtistId(req, res, next){
    const artistId = parseInt(req.query.artistId);
    let notify = NotifyController.getNotify();

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

  deleteSubscriptionsByArtistId(req, res, next){
    const artistId = parseInt(req.body.artistId);
    let notify = NotifyController.getNotify();
    notify.deleteSubscriptions(artistId).then((service) => {

        NotifyController.saveNotify(service);

        res.status(200);
        res.json();

    }).catch(err => {
        if(err instanceof NonExistentException){
            next(new errores.ResourceNotFound());
        } else {
            next(new errores.BadRequest()); 
        }
    });
  }

}

module.exports = new SubscriptionController();