
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Playlist = require('./playlist')
const Track = require('./track')
const Artist = require('./artist')
const Album = require('./album')
const ExistException = require('./existException')
const NonExistentArtistException = require('./nonExistentArtisException')
const User = require('./user')

class UNQfy {
  constructor(){
    this._artists = []
    this._playLists = []
    this._users = []
    this._nextArtistId = 0
    this._nextAlbumId = 0
    this._nextTrackId = 0
    this._nextPlaylistId = 0
    this._nextUserId = 0
  }

  get nextArtistId(){return this._nextArtistId}
  get nextAlbumId(){return this._nextAlbumId}
  get nextTrackId(){return this._nextTrackId}
  get nextPlaylistId(){return this._nextPlaylistId}
  get artists(){return this._artists}
  get playLists(){return this._playLists}
  get users(){return this._users}
  get nextUserId(){return this._nextUserId}

  set nextArtistId(value){return this._nextArtistId = value}
  set nextAlbumId(value){return this._nextAlbumId = value}
  set nextTrackId(value){return this._nextTrackId = value}
  set nextPlaylistId(value){return this._nextPlaylistId = value}
  set nextUserId(value){return this._nextUserId = value}

  addUser(userName){
    const newUser = new User(this.nextUserId, userName)
    this._users.unshift(newUser)
    this.nextUserId = this.nextUserId + 1
    return newUser
  }

  hear(userId, trackId){
    this.getUserById(userId).head(this.getTrackById(trackId))
  }

  timesHeard(userId, trackId){
    return this.getUserById(userId).timesHeard(this.getTrackById(trackId).name)
  }

  mostHeard(userId, artistId){
    return this.getUserById(userId).mostHeard(this.getArtistById(artistId).name)
  }

  addArtist(artistData) {
    if(this.artists.some(a => a.name === artistData.name)){
      throw new ExistException("Ya existe un artista con nombre: " + artistData.name)
    }
    let newArtist = new Artist(artistData.name, this.nextArtistId, artistData.country)
    this.artists.unshift(newArtist)
    this.nextArtistId = this.nextArtistId + 1
    return newArtist
  }

  addAlbum(artistId, albumData) {
    let artistFinded = this.artists.find(a => a.id == artistId)
    if(artistFinded === null){
      throw NonExistentArtistException("No existe un artista con ID: " + artistId)
    }
    let newAlbum = new Album(albumData.name, this.nextAlbumId, albumData.year, artistFinded)
    this.nextAlbumId = this.nextAlbumId + 1
    artistFinded.addAlbum(newAlbum)
    return newAlbum
  }

  addTrack(albumId, trackData) {
    const albumFinded = this.artists.map(a => a.albums).flat().find(a => a.id == albumId)
    if(albumFinded.tracks.some(t => t.name === trackData.name)){
      throw new ExistException("Ya existe un track con nombre: " + trackData.name)
    }
    const newTrack = new Track(trackData.name, this.nextTrackId, albumFinded, albumFinded._artist, trackData.genres, trackData.duration)
    this.nextTrackId = this.nextTrackId + 1
    albumFinded.addTrack(newTrack)
    return newTrack
  }

  removeArtist(artistId){
    const artist = this.getArtistById(artistId)
    this.playLists.removeTracks(artist.albums.map(a => a.tracks).flat())
    this.artists.splice(this.artists.indexOf(artist.id), 1)
  }

  removeAlbum(albumId){
    const album = this.getAlbumById(albumId)
    this.playLists.removeTracks(album.tracks)
    album.artist.removeAlbum(album)
  }

  removeTrack(trackId){
    const track = this.getTrackById(trackId)
    this.playLists.removeTrack(track)
    track.album.removeTrack(track)
  }

  removePlayList(playListId){
    const playList = this.playLists.find(p => p.id === playListId)
    this.playLists.splice(this.playLists.indexOf(playList), 1)
  }

  searchByName(st){
    return {
      artists: this.artists.filter(a => a.name.includes(st)),
      albums: this.artists.map(a => a.albums).flat().filter(a => a.name.includes(st)),
      tracks: this.artists.map(a => a.albums).flat().map(a => a.tracks).flat().filter(t => t.name.includes(st)),
      playlists: this.playLists.filter(p => p.name.includes(st))
    }
  }

  getUserById(id){
    return this.users.find(u => u.id === id)
  }

  getArtistById(id) {
    return this.artists.find(a => a.id == id)
  }

  getAlbumById(id) {
    return this.artists.map(a => a.albums).flat().find(a => a.id == id)
  }

  getTrackById(id) {
    return this.artists.map(a => a.albums).flat().map(a => a.tracks).flat().find(t => t.id == id)
  }

  getPlaylistById(id) {
    return this.playLists.find(p => p._id === id)
  }

  getTracksMatchingGenres(genress) {
    return this.artists.map(a => a.albums).flat().map(a => a.tracks).flat().filter(t => t.genres.some(g => genress.includes(g)))
  }

  getTracksMatchingArtist(artistName) {
    return this.artists.find(a => a.name === artistName).albums.map(a => a.tracks).flat()
  }

  createPlaylist(name, genresToInclude, maxDuration) {
    const tracks = this.getTracksMatchingGenres(genresToInclude)
    const newPlaylist = new Playlist(this.nextPlaylistId, name, genresToInclude, maxDuration)
    this.nextPlaylistId = this.nextPlaylistId + 1
    tracks.forEach(t => newPlaylist.addTrack(t))
    this.playLists.unshift(newPlaylist)
    return newPlaylist
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
    const classes = [UNQfy, Artist, Album, Track, Playlist];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }

}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy
};

