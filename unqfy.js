
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Playlist = require('./playlist')
const Track = require('./track')
const Artist = require('./artist')
const Album = require('./album')

class UNQfy {
  constructor(){
    this._artists = []
    this._nextArtistId = 0
    this._nextAlbumId = 0
    this._nextTrackId = 0
  }

  get nextArtistId(){return this._nextArtistId}
  get nextAlbumId(){return this._nextAlbumId}
  get nextTrackId(){return this._nextTrackId}
  get artists(){return this._artists}

  set nextArtistId(value){return this._nextArtistId = value}
  set nextAlbumId(value){return this._nextAlbumId = value}
  set nextTrackId(value){return this._nextTrackId = value}

  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData) {
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
    let newAlbum = new Album(albumData.name, this.nextAlbumId, albumData.year, artistFinded)
    this.nextAlbumId = this.nextAlbumId + 1
    artistFinded.addAlbum(newAlbum)
    console.log(newAlbum)
    return newAlbum
  }


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
    let albumFinded = this.artists.map(a => a.albums).flat().find(a => a.id == albumId)
    let newTrack = new Track(trackData.name, this.nextTrackId, albumFinded, albumFinded._artist, trackData.genres, trackData.duration)
    this.nextTrackId = this.nextTrackId + 1
    albumFinded.addTrack(newTrack)
    console.log(newTrack)
    return newTrack
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
  }

  getArtistById(id) {
    return this.artists.find(a => a.id == id)
  }

  getAlbumById(id) {
    return this.artists.map(a => a.albums).flat().find(a => a.id == id)
  }

  getTrackById(id) {
    //return this.artists.map(a => a.albums).flat().map(a => a.tracks).flat().find(t => t.id == id)
  }

  getPlaylistById(id) {

  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {

  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {

  }


  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */

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

