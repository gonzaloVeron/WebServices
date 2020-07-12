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
        return this.verifyEmail(email).then((dirEmail) => {
            return this.verifyArtistId(artistId).then((id) => {
                return UnqfyClient.checkearExistenciaDeArtista(id).then((existArtist) => {
                    if(existArtist){
                        
                        const artist = this._subscriptions.find(obj => obj.artistId === id);
                        if(artist && !artist.emails.some(e => e === dirEmail)){
                            artist.emails.push(dirEmail);
                        }else{
                            this._subscriptions.push({artistId : id, emails : [dirEmail]})
                        }
                        
                        return Promise.resolve(this);
                    }else{
                        throw new NonExistentException();
                    }
                }).catch(err => Promise.reject(err));
            }).catch(err => Promise.reject(err));
        }).catch(err => Promise.reject(err));
    }  

    unsubscribe(email, artistId){
        return this.verifyEmail(email).then((dirEmail) => {
            return this.verifyArtistId(artistId).then((id) => {
                return UnqfyClient.checkearExistenciaDeArtista(id).then((existArtist) => {
                    if(existArtist){
                        
                        const artist = this._subscriptions.find(obj => obj.artistId === id);
                        if(artist && artist.emails.some(e => e === dirEmail)){
                            artist.emails.splice(artist.emails.indexOf(dirEmail), 1);
                        }

                        return Promise.resolve(this);
                    }else{
                        throw new NonExistentException();
                    }
                }).catch(err => Promise.reject(err));
            }).catch(err => Promise.reject(err));
        }).catch(err => Promise.reject(err));
    }

    notify(artistId, subject, message){
        return this.verifyArtistId(artistId).then((id) => {
            return this.verifyNotify(subject, message).then((data) => {
                const artist = this._subscriptions.find(obj => obj.artistId === id)
                if(artist){
                    artist.emails.forEach(e => sendMail.sendMessage(data.subject, data.message, e));
                }else{
                    throw new NonExistentException();
                }
                
                return Promise.resolve();
            })
        }).catch(err => Promise.reject(err));
        //Gonzalo Veron <gonveron96@gmail.com>
    }

    subscriptions(artistId){
        return this.verifyArtistId(artistId).then((id) => {
            return UnqfyClient.checkearExistenciaDeArtista(id).then(
                (existArtist) => {
                    if(existArtist){

                        const artist = this._subscriptions.find(obj => obj.artistId === id);
                        const emails = (artist) ? artist.emails : []
                        
                        return Promise.resolve(emails);
                    }else{
                        throw new NonExistentException();
                    }
                }).catch(err => Promise.reject(err));
        }).catch(err => Promise.reject(err));
    }
    
    deleteSubscriptions(artistId){
        return this.verifyArtistId(artistId).then((id) => {
            return UnqfyClient.checkearExistenciaDeArtista(id).then(
                (existArtist) => {
                    if(existArtist){

                        const artist = this._subscriptions.find(obj => obj.artistId === id);
                        artist.emails = [];

                        return Promise.resolve(this);
                    }else{
                        throw new NonExistentException();
                    }
                }).catch(err => Promise.reject(err));
        }).catch(err => Promise.reject(err));
    }
    
    //------------------------------------------//

    verifyArtistId(artistId){
        return new Promise((resolve, reject) => {
            if(isNaN(artistId)){
                throw new MissingDataException();
            }
            resolve(artistId);
        }).catch(err => Promise.reject(err));
    }
    
    verifyEmail(email){
        return new Promise((resolve, reject) => {
            if(!email){
                throw new MissingDataException();
            }
            resolve(email);
        }).catch(err => Promise.reject(err));
    }
    
    verifyNotify(subject, message){
        return new Promise((resolve, reject) => {
            if(!subject || !message){
                throw new MissingDataException();
            }
            resolve({subject, message})
        }).catch(err => Promise.reject(err));
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