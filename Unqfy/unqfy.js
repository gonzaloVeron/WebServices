
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Playlist = require('./Playlist');
const Track = require('./Track');
const Artist = require('./Artist');
const Album = require('./Album');
const ExistException = require('./ExistException');
const NonExistentException = require('./NonExistentException');
const MissingDataException = require('./MissingDataException');
const User = require('./User');
const rp = require('request-promise');
const NotifyClient = require('./NotifyClient');
const LogginClient = require('./LogginClient');
const ACCESS_TOKEN = 'BQCxTfIZOEIzvwOcgtuL65_s5H-2RiRlIwGT2XDLOqy-rbfSxE8_cDJkRXNCYkY_-Mh3_5AM8EFby6N40LO94Ke0CdO5v7mzd5a-OnA2HpdAX4eSIoUp0G06O0aquRCe0EJHcne7LS2fG4Zh04nqf_SNsR4O0c_2TDu5Hg';

class UNQfy {
  constructor(){
    this._artists = [];
    this._playLists = [];
    this._users = [];
    this._nextArtistId = 0;
    this._nextAlbumId = 0;
    this._nextTrackId = 0;
    this._nextPlaylistId = 0;
    this._nextUserId = 0;
    this._observer = new NotifyClient();
  }

  get nextArtistId(){return this._nextArtistId;}
  get nextAlbumId(){return this._nextAlbumId;}
  get nextTrackId(){return this._nextTrackId;}
  get nextPlaylistId(){return this._nextPlaylistId;}
  get artists(){return this._artists;}
  get playLists(){return this._playLists;}
  get users(){return this._users;}
  get nextUserId(){return this._nextUserId;}

  set nextArtistId(value){return this._nextArtistId = value;}
  set nextAlbumId(value){return this._nextAlbumId = value;}
  set nextTrackId(value){return this._nextTrackId = value;}
  set nextPlaylistId(value){return this._nextPlaylistId = value;}
  set nextUserId(value){return this._nextUserId = value;}

  addUser(userName){
    this.verifyValidName(userName);
    this.verifyExitingName(userName);
    const newUser = new User(this.nextUserId, userName);
    this.users.push(newUser);
    this.nextUserId = this.nextUserId + 1;
    LogginClient.log('info', `Se agrego el usuario ${userName}`);
    return newUser;
  }

  hear(userId, trackId){
    const userFinded = this.getUserById(userId);
    const trackFinded = this.getTrackById(trackId);
    if(userFinded === undefined || trackFinded === undefined){
      throw new NonExistentException();
    }
    userFinded.hear(trackFinded);
  }

  timesHeard(userId, trackId){
    const userFinded = this.getUserById(userId);
    const trackFinded = this.getTrackById(trackId);
    if(userFinded === undefined || trackFinded === undefined){
      throw new NonExistentException();
    }
    return userFinded.timesHeard(trackFinded.name);
  }

  mostHeard(userId, artistId){
    const userFinded = this.getUserById(userId);
    const artistFinded = this.getArtistById(artistId);
    if(userFinded === undefined || artistFinded === undefined){
      throw new NonExistentException();
    }
    return userFinded.mostHeard(artistFinded.name);
  }

  removeUser(userId){
    const user = this.getUserById(userId);
    this.users.splice(this.users.indexOf(userId), 1);
    LogginClient.log('info', `Se removio el usuario ${user.name}`);
  }
  
  updateUserById(userId, newUserName){
    const userFinded = this.getUserById(userId);
    this.verifyValidName(newUserName);
    if(userFinded === undefined){
      throw new NonExistentException();
    }
    this.verifyExitingName(newUserName);
    userFinded.name = newUserName;
    return userFinded;
  }

  verifyValidName(userName){
    if(userName === undefined){
      throw new MissingDataException();
    }
  }

  verifyExitingName(userName){
    if(this.users.some(u => u.name === userName)){
      throw new ExistException();
    }
  }

  addArtist(artistData) {
    this.verifyArtistData(artistData);
    if(this.artists.some(a => a.name === artistData.name)){
      throw new ExistException('Ya existe un artista con nombre: ' + artistData.name);
    }
    const newArtist = new Artist(artistData.name, this.nextArtistId, artistData.country, this._observer);
    this.artists.push(newArtist);
    this.nextArtistId = this.nextArtistId + 1;
    LogginClient.log('info', `Se agrego el artista ${artistData.name}`);
    return newArtist;
  }

  verifyArtistData(artistData) {
    if(artistData.name === undefined || artistData.country === undefined){
      throw new MissingDataException();
    }
  }

  updateArtistById(id, artistData){
    const artist = this.getArtistById(id);
    const keys = Object.keys(artistData);
    keys.forEach(k => artist[k] = artistData[k]);
    return artist;
  }

  updateAlbumById(id, albumData){
    const album = this.getAlbumById(id);
    const keys = Object.keys(albumData);
    keys.forEach(k => album[k] = albumData[k]);
    return album;
  }

  addAlbum(artistId, albumData) {
    this.verifyAlbumData(artistId, albumData);
    const artistFinded = this.artists.find(a => a.id === artistId);
    if(artistFinded === undefined){
      throw new NonExistentException('No existe un artista con ID: ' + artistId);
    }
    const newAlbum = new Album(albumData.name, this.nextAlbumId, albumData.year, artistFinded);
    artistFinded.addAlbum(newAlbum);
    this.nextAlbumId = this.nextAlbumId + 1;
    LogginClient.log('info', `Se agrego el album ${albumData.name}`);
    return newAlbum;
  }

  verifyAlbumData(artistid, albumData) {
    if(albumData.name === undefined || albumData.year === undefined || isNaN(artistid)){
      throw new MissingDataException();
    }
  }

  addTrack(albumId, trackData) {
    this.verifyTrackData(trackData);
    const albumFinded = this.getAlbumById(albumId);
    if(albumFinded === undefined){
      throw new NonExistentException();
    }
    const newTrack = new Track(trackData.name, this.nextTrackId, albumFinded, albumFinded._artist, trackData.genres, trackData.duration);
    this.nextTrackId = this.nextTrackId + 1;
    albumFinded.addTrack(newTrack);
    LogginClient.log('info', `Se agrego el track ${trackData.name}`);
    return newTrack;
  }

  verifyTrackData(trackData) {
    if(trackData.name === undefined || trackData.genres === undefined || trackData.duration === undefined){
      throw new MissingDataException();
    }
  }

  removeArtist(artistId){
    const artist = this.getArtistById(artistId);
    this.playLists.forEach(p => p.removeTracks(artist.albums.map(a => a.tracks).flat()));
    this.artists.splice(this.artists.indexOf(artist.id), 1);
    LogginClient.log('info', `Se removio el artista ${artist.name}`);
  }

  removeAlbum(albumId){
    const album = this.getAlbumById(albumId);
    this.playLists.forEach(p => p.removeTracks(album.tracks));
    album.artist.removeAlbum(album);
    LogginClient.log('info', `Se removio el album ${album.name}`);
  }

  removeTrack(trackId){
    const track = this.getTrackById(trackId);
    this.playLists.forEach(p => p.removeTrack(track));
    track.album.removeTrack(track);
    LogginClient.log('info', `Se removio el track ${track.name}`);
  }

  removePlayList(playListId){
    const playList = this.playLists.find(p => p.id === playListId);
    this.playLists.splice(this.playLists.indexOf(playList), 1);
    LogginClient.log('info', `Se removio la playlist ${playList.name}`);
  }

  searchByName(st){
    return {
      artists: this.artists.filter(a => a.name.toLowerCase().includes(st.toLowerCase())),
      albums: this.artists.map(a => a.albums).flat().filter(a => a.name.toLowerCase().includes(st.toLowerCase())),
      tracks: this.artists.map(a => a.albums).flat().map(a => a.tracks).flat().filter(t => t.name.toLowerCase().includes(st.toLowerCase())),
      playlists: this.playLists.filter(p => p.name.toLowerCase().includes(st.toLowerCase()))
    };
  }

  getArtisByName(artistName){
    return this.artists.find(a => a.name === artistName);
  }

  getUserById(id){
    return this.users.find(u => u.id === id);
  }

  getArtistById(id) {
    const artist = this.artists.find(a => a.id === id);
    if (artist === undefined){
      throw new NonExistentException('No existe un artist con ID: ' + id); 
    }
    return artist;
  }

  getAlbumById(id) {
    const album = this.artists.flatMap(a => a.albums).find(a => a.id === id);
    if (album === undefined){
      throw new NonExistentException('No existe un album con ID: ' + id); 
    }
    return album;
  }

  getTrackById(id) {
    const track = this.artists.flatMap(a => a.tracks()).find(t => t.id === id);
    if (track === undefined){
      throw new NonExistentException('No existe un track con ID: ' + id); 
    }
    return track;
  }

  getPlaylistById(id) {
    const playList = this.playLists.find(p => p._id === id);
    if (playList === undefined){
      throw new NonExistentException('No existe un playList con ID: ' + id); 
    }
    return playList;
  }

  albums(){
    return this.artists.flatMap(a => a.albums);
  }
  getTracksMatchingGenres(genress) {
    return this.artists.map(a => a.albums).flat().map(a => a.tracks).flat().filter(t => t.genres.some(g => genress.includes(g)));
  }

  getTracksMatchingArtist(artistName) {
    return this.getArtisByName(artistName).albums.map(a => a.tracks).flat();
  }

  getAlbumsForArtist(artistName){
    return this.getArtisByName(artistName).albums.map(a => a.name);
  }

  getLyrics(trackId){
    return this.getTrackById(trackId).getLyrics();
  }

  searchArtistInSpotify(artistName){
    const options = {
      url: 'https://api.spotify.com/v1/search',
      headers: { Authorization: 'Bearer ' + ACCESS_TOKEN },
      qs: {
        q:artistName,
        type:'artist',
      },
      json: true,
    };
    return rp.get(options).then(response => {
      return response.artists.items[0];
    });
  }

  populateAlbumsForArtist(artistName){
    return this.searchArtistInSpotify(artistName).then(artist => {
      const options = {
        url: `https://api.spotify.com/v1/artists/${artist.id}/albums`,
        headers: { Authorization: 'Bearer ' + ACCESS_TOKEN },
        json: true,
      };
      return rp.get(options).then(response => {
        const artistId = this.getArtisByName(artistName).id;
        response.items.forEach(i => {
          const albumData = {name: i.name, year: i.release_date.slice(0, 4)};
          this.addAlbum(artistId, albumData);
        });
      });
    }).catch(err => console.log('Algo malio sal'));
  }

  createPlaylist(name, genresToInclude, maxDuration) {
    const tracks = this.getTracksMatchingGenres(genresToInclude);
    const newPlaylist = new Playlist(this.nextPlaylistId, name, genresToInclude, maxDuration);
    this.nextPlaylistId = this.nextPlaylistId + 1;
    tracks.forEach(t => newPlaylist.addTrack(t));
    this.playLists.push(newPlaylist);
    LogginClient.log('info', `Se agrego la playlist ${name}`);
    return newPlaylist;
  }

  createPlaylistByIds(name, tracksids){
    const tracks = tracksids.map(id => this.getTrackById(id));
    const duracionMaxima = this.tracks.reduce((acc, elem) => Math.max(acc, elem.duration));
    const newPlaylist = new Playlist(this.nextPlaylistId, name, [], duracionMaxima);
    tracks.forEach(t => newPlaylist.addTrack(t));
    this.nextPlaylistId = this.nextPlaylistId + 1;
    this.playLists.push(newPlaylist);
    LogginClient.log('info', `Se agrego la playlist ${name}`);
    return newPlaylist;
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
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track, Playlist, User, NotifyClient];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }

}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy
};

