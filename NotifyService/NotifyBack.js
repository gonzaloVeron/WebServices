const servicio = require('./Servicio');
const NonExistentException = require('./NonExistentException');
const MissingDataException = require('./MissingDataException');
const gmailClient = require('./gmail-tools/send-mail-example/gmailClient');
const { gmail } = require('googleapis/build/src/apis/gmail');
const sendMail = require('./gmail-tools/send-mail-example/sendMail');

class NotifyBack{
    constructor(){
        this._subscriptions = []
    }

    subscribe(email, artistId){
        this.verifyEmail(email);
        this.verifyArtistId(artistId);
        this.verifyArtistInUnqfy(artistId);
        const artist = this._subscriptions.find(obj => obj.artistId === artistId);
        if(artist && !artist.emails.any(e => e === email)){
            artist.emails.push(email);
        }else{
            this._subscriptions.push({artistId, emails : [email]})
        }
    }  

    unsubscribe(email, artistId){
        this.verifyEmail(email);
        this.verifyArtistId(artistId);
        this.verifyArtistInUnqfy(artistId)
        const artist = this._subscriptions.find(obj => obj.artistId === artistId);
        if(artist && artist.emails.any(e => e === email)){
            artist.emails.splice(artist.emails.indexOf(email), 1);
        }
        
    }

    notify(artistId, subject, message){
        this.verifyArtistId(artistId);
        this.verifyNotify(subject, message);
        const artist = this._subscriptions.find(obj => obj.artistId === artistId)
        if(!artist){
            artist.email.forEach(e => sendMail.sendMessage(subject, message, e));
        }
        //Gonzalo Veron <gonveron96@gmail.com>
    }

    subscriptions(artistId){
        this.verifyArtistId(artistId);
        this.verifyArtistInUnqfy(artistId);
        const artist = this._subscriptions.find(obj => obj.artistId === artistId);
        return (artist) ? artist.email : [];
    }

    deleteSubscriptions(artistId){
        this.verifyArtistId(artistId);
        this.verifyArtistInUnqfy(artistId);
        const artist = this._subscriptions.find(obj => obj.artistId === artistId);
        artist.emails = [];
    }

    //--------------------//

    verifyArtistInUnqfy(artistId){
        if(!servicio.checkearExistenciaDArtista(artistId)){
            throw new NonExistentException();
        }
    }

    verifyEmail(email){
        if(!email){
            throw new MissingDataException();
        }
    }
    verifyArtistId(artistId){
        if(!artistId){
            throw new MissingDataException();
        }
    }

    verifyNotify(subject, message){
        if(!subject || !message){
            throw new MissingDataException();
        }
    }
}

module.export = new NotifyBack()