const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const { checkearExistenciaDeArtista } = require('./Servicio');
const NonExistentException = require('./NonExistentException');
const MissingDataException = require('./MissingDataException');
const gmailClient = require('./gmail-tools/send-mail-example/gmailClient');
const { gmail } = require('googleapis/build/src/apis/gmail');
const sendMail = require('./gmail-tools/send-mail-example/sendMail');
const { throws } = require('assert');

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
        console.log("dadasdasd");
        this.verifyArtistId(artistId);
        checkearExistenciaDeArtista(artistId).then(artistExist => {
            console.log(artistExist);
            if(artistExist){
                const artist = this._subscriptions.find(obj => obj.artistId === artistId);
                return (artist) ? artist.email : [];
            } else {
                throw new NonExistentException();
            }
        }).catch(err => false);
        //this.verifyArtistInUnqfy(artistId);
        
    }
    
    deleteSubscriptions(artistId){
        this.verifyArtistId(artistId);
        this.verifyArtistInUnqfy(artistId);
        const artist = this._subscriptions.find(obj => obj.artistId === artistId);
        artist.emails = [];
    }
    
    //--------------------//
    
    verifyArtistInUnqfy(artistId){
        return checkearExistenciaDeArtista(artistId)
        /*if(!checkearExistenciaDeArtista(artistId)){
            throw new NonExistentException()
        }*/   
    }

    verifyEmail(email){
        if(!email){
            throw new MissingDataException();
        }
    }
    verifyArtistId(artistId){
        if(isNaN(artistId)){
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