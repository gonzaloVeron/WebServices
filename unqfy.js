
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Playlist = require('./playlist')
const Track = require('./track')
const Artist = require('./artist')
const Album = require('./album')
const ExistException = require('./existException')
const NonExistentArtistException = require('./nonExistentArtisException')

class UNQfy {
  constructor(){
    this._artists = []
    this._playLists = []
    this._nextArtistId = 0
    this._nextAlbumId = 0
    this._nextTrackId = 0
  }

  get nextArtistId(){return this._nextArtistId}
  get nextAlbumId(){return this._nextAlbumId}
  get nextTrackId(){return this._nextTrackId}
  get artists(){return this._artists}
  get playLists(){return this._playLists}

  set nextArtistId(value){return this._nextArtistId = value}
  set nextAlbumId(value){return this._nextAlbumId = value}
  set nextTrackId(value){return this._nextTrackId = value}

  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData) {
    if(this.artists.some(a => a.name === artistData.name)){
      throw new ExistException("Ya existe un artista con: "+artistData.name)
    }
    let newArtist = new Artist(artistData.name, this.nextArtistId, artistData.country)
    this.artists.unshift(newArtist)
    this.nextArtistId = this._nextArtistId + 1
    return newArtist
  }


  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
    let artistFinded = this.artists.find(a => a.id == artistId)
    if(artistFinded === null){
      throw NonExistentArtistException("No existe un artista con ID: "+artistId)
    }
    let newAlbum = new Album(albumData.name, this.nextAlbumId, albumData.year, artistFinded)
    this.nextAlbumId = this.nextAlbumId + 1
    artistFinded.addAlbum(newAlbum)
    return newAlbum
  }


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
    let albumFinded = this.artists.map(a => a.albums).flat().find(a => a.id == albumId)
    if(albumFinded.tracks.some(t => t.name === trackData.name)){
      throw new ExistException("Ya existe un track con: "+trackData.name)
    }
    let newTrack = new Track(trackData.name, this.nextTrackId, albumFinded, albumFinded._artist, trackData.genres, trackData.duration)
    this.nextTrackId = this.nextTrackId + 1
    albumFinded.addTrack(newTrack)
    return newTrack
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
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

  removePlayList(playListName){
    const playList = this.playLists.find(p => p.name === playListName)
    this.playLists.splice(this.playLists.indexOf(playList), 1)
  }

  //Devuelve un objeto con 4 listas
  searchByName(st){
    const playlists = this.playLists.filter(p => p.name.includes(st))
    const artists = this.artists.filter(a => a.name.includes(st))
    const albums = this.artists.map(a => a.albums).flat().filter(a => a.name.includes(st))
    const tracks = this.artists.map(a => a.albums).flat().map(a => a.tracks).flat().filter(t => t.name.includes(st))
    return {
      artists: artists,
      albums: albums,
      tracks: tracks,
      playlists: playlists,
    }
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

  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genress) {
    return this.artists.map(a => a.albums).flat().map(a => a.tracks).flat().filter(t => t.genres.some(g => genress.includes(g)))
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {
    return this.artists.find(a => a.name === artistName).albums.map(a => a.tracks).flat()
  }


  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, maxDuration, genresToInclude) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */
    const tracks = this.getTracksMatchingGenres(genresToInclude)
    const newPlaylist = new Playlist(name, genresToInclude, maxDuration)
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
  UNQfy, Artist, Album, Track, Playlist
};

