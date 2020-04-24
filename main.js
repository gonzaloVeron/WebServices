

const fs = require('fs') // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy') // importamos el modulo unqfy
const Playlist = require('./playlist')
const Track = require('./track')
const Artist = require('./artist')
const Album = require('./album')
const InvalidCommandException = require('./invalidCommandException')

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
  unqfy.save(filename);
}

/*
 En esta funcion deberán interpretar los argumentos pasado por linea de comandos
 e implementar los diferentes comandos.

  Se deberán implementar los comandos:
    - Alta y baja de Artista
    - Alta y Baja de Albums
    - Alta y Baja de tracks

    - Listar todos los Artistas
    - Listar todos los albumes de un artista
    - Listar todos los tracks de un album

    - Busqueda de canciones intepretadas por un determinado artista
    - Busqueda de canciones por genero

    - Dado un string, imprimmir todas las entidades (artistas, albums, tracks, playlists) que coincidan parcialmente
    con el string pasado.

    - Dada un nombre de playlist, una lista de generos y una duración máxima, crear una playlist que contenga
    tracks que tengan canciones con esos generos y que tenga como duración máxima la pasada por parámetro.

  La implementacion de los comandos deberá ser de la forma:
   1. Obtener argumentos de linea de comando
   2. Obtener instancia de UNQfy (getUNQFy)
   3. Ejecutar el comando correspondiente en Unqfy
   4. Guardar el estado de UNQfy (saveUNQfy)

*/

function addArtist(artistData){
  let unquify = getUNQfy()
  unquify.addArtist(artistData)
  saveUNQfy(unquify)
}

function addAlbum(artistId, albumData){
  let unquify = getUNQfy()
  unquify.addAlbum(artistId, albumData)
  saveUNQfy(unquify)
}

function addTrack(albumId, trackData){
  let unquify = getUNQfy()
  unquify.addTrack(albumId, trackData)
  saveUNQfy(unquify)
}

function getArtistById(id) {
  return getUNQfy().getArtistById(id)
}

function getAlbumById(id) {
  return getUNQfy().getAlbumById(id)
}

function getTrackById(id) {
  return getUNQfy().getTrackById(id)
}

function main() {
  //console.log('arguments: ');
  //let args2 = process.argv.forEach(argument => console.log(argument));
  let args = process.argv

  switch(args[2]){
    case "addArtist": //Modo de uso: node main.js addArtist artistName artistCountry
      let artistData = {name: args[3], country: args[4]}
      addArtist(artistData)
      break
    case "addAlbum": //Modo de uso: node main.js addAlbum artistId albumName year month day
      let creationDate = new Date(args[5], args[6], args[7])
      let albumData = {name: args[4], date: creationDate}
      addAlbum(args[3], albumData)
      break
    case "addTrack": //Modo de uso: node main.js addTrack albumId trackName trackDuration trackGenre1 trackGenre2 trackGenre3
      let trackGenres = [args[6], args[7], args[8]]
      let trackData = {name: args[4], duration: parseInt(args[5]), genres: trackGenres}
      addTrack(args[3], trackData)
      break
    case "getArtistById":
      console.log(getArtistById(args[3]))
      break
    case "getAlbumById":
      console.log(getAlbumById(args[3]))
      break
    case "getTrackById":
      //No funca
      //console.log(getTrackById(args[3]))
      //break
            //Llamar a la funcion del caso.
    case "getPlaylistById":
      //Llamar a la funcion del caso.
    case "getTracksMatchingGenres":
      //Llamar a la funcion del caso.
    case "getTracksMatchingArtist":
      //Llamar a la funcion del caso.
    case "createPlaylist":
      //Llamar a la funcion del caso.
    default:
      throw new InvalidCommandException("El comando " + args[2] + " no existe")
  }
}


main();
