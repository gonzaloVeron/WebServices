const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
//const { checkearExistenciaDeArtista } = require('./UnqfyClient');
const NonExistentException = require('./NonExistentException');
const MissingDataException = require('./MissingDataException');
const UnqfyClient = require('./UnqfyClient');
const gmailClient = require('./gmail-tools/send-mail-example/gmailClient');
const { gmail } = require('googleapis/build/src/apis/gmail');
const sendMail = require('./gmail-tools/send-mail-example/sendMail');
const { isRegExp } = require('util');
const { nextTick } = require('process');
const errores = require('./APIError');

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
        return UnqfyClient.checkearExistenciaDeArtista(artistId).then(
            (existArtist) => {
                if(existArtist){
                    const artist = this._subscriptions.find(obj => obj.artistId === artistId);
                    return Promise.resolve((artist) ? artist.email : []);
                }else{
                    throw new NonExistentException();
                }
            }
        ).catch(err => {return Promise.reject(err)})
    }
    
    deleteSubscriptions(artistId){
        this.verifyArtistId(artistId);
        this.verifyArtistInUnqfy(artistId);
        const artist = this._subscriptions.find(obj => obj.artistId === artistId);
        artist.emails = [];
    }
    
    //--------------------//

    verifyEmail(email){
        if(!email){
            throw new MissingDataException();
        }
    }

    verifyNotify(subject, message){
        if(!subject || !message){
            throw new MissingDataException();
        }
    }

    save(filename) {
        const listenersBkp = this.listeners;
        this.listeners = [];
    
        const serializedData = picklify.picklify(this);
    
        this.listeners = listenersBkp;
        fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
    }
    
    static load(filename) {
        const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
        const classes = [NotifyBack];
        return picklify.unpicklify(JSON.parse(serializedData), classes);
    }
}

module.exports = {
    NotifyBack
};