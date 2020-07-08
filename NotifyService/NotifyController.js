const errores = require('./APIError');
const NotifyBack = require('./NotifyBack');
const NonExistentException = require('./NonExistentException');

class NotifyController {

  subscribe(req, res) {
    const artistId = parseInt(req.body.artistId);
    const email = req.body.email;
    try{
        NotifyBack.subscribe(email, artistId);

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

  unsuscribe(req, res){
    const artistId = parseInt(req.body.artistId);
    const email = req.body.email;
    try{
        NotifyBack.unsubscribe(email, artistId);

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

  notify(req, res){
    const artistId = parseInt(req.body.artistId);
    const subject = req.body.subject;
    const message = req.body.message;
    try{
        NotifyBack.notify(artistId, subject, message);

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

  getSubscriptionsByArtistId(req, res){
    const artistId = parseInt(req.params.artistId);
    let emails;
    try{
        emails = NotifyBack.subscriptions(artistId);

    }catch(err){
        if(err instanceof NonExistentException){
            throw new errores.ResourceNotFound();
        } else {
            throw new errores.BadRequest(); 
        }
    }
    res.status(200);
    res.json({
        "artistId": artistId,
        "subscriptors": emails
      });
  }

  deleteSubscriptionsByArtistId(req, res){
    const artistId = parseInt(req.body.artistId);
    try{
        NotifyBack.deleteSubscriptions(artistId);

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

}

module.exports = new NotifyController();