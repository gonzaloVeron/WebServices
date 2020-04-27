

const fs = require('fs') // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy') // importamos el modulo unqfy
const Playlist = require('./playlist')
const Track = require('./track')
const Artist = require('./artist')
const Album = require('./album')
const InvalidCommandException = require('../../../Downloads/WebServices/invalidCommandException')

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
  const unquify = getUNQfy()
  unquify.addArtist(artistData)
  saveUNQfy(unquify)
}

function addAlbum(artistId, albumData){
  const unquify = getUNQfy()
  unquify.addAlbum(artistId, albumData)
  saveUNQfy(unquify)
}

function addTrack(albumId, trackData){
  const unquify = getUNQfy()
  unquify.addTrack(albumId, trackData)
  saveUNQfy(unquify)
}

function getArtistById(id) {
   console.log(getUNQfy().getArtistById(id))
}

function getAlbumById(id) {
  console.log(getUNQfy().getAlbumById(id))
}

function getTrackById(id) {
  console.log(getUNQfy().getTrackById(id))
}

function removeArtist(id){
  const unquify = getUNQfy()
  unquify.removeArtist(id)
  saveUNQfy(unquify)
}

function removeAlbum(albumId){
  const unquify = getUNQfy()
  unquify.removeAlbum(albumId)
  saveUNQfy(unquify)
}
function removeTrack(trackId){
  const unquify = getUNQfy()
  unquify.removeTrack(trackId)
  saveUNQfy(unquify)
}
function removePlayList(playListName){ // o id
  const unquify = getUNQfy()
  unquify.removePlayList(playListName)
  saveUNQfy(unquify)
}
function searchByName(st){
  const unquify = getUNQfy()
  unquify.searchByName(st)
  saveUNQfy(unquify)
}
function getTracksMatchingGenres(genres){
  const unquify = getUNQfy()
  unquify.getTracksMatchingGenres(genres)
  saveUNQfy(unquify)
}
function getTracksMatchingArtist(artistName){
  const unquify = getUNQfy()
  unquify.getTracksMatchingArtist(artistName)
  saveUNQfy(unquify)
}
function createPlaylist(name, maxDuration, genresToInclude) {
  const unquify = getUNQfy()
  unquify.createPlaylist(name, maxDuration, genresToInclude)
  saveUNQfy(unquify)
}

const commands = {
  "addArtist" : args => addArtist({name : args[0], country : args[1]}),
  "addAlbum" : args => addAlbum(args[0],{name : args[1], year : args[2]}),
  "addTrack": args => addTrack(args[0], {name : args[1], duration : args[2], genres : args.slice(3, args.length)}), 
  "getArtistById" : args => getArtistById(args[0]),
  "getAlbumById" : args => getAlbumById(args[0]),
  "getTrackById" : args => getTrackById(args[0]),
  "getTracksMatchingGenres" : args => getTracksMatchingGenres(args),
  "getTracksMatchingArtist" : args => getTracksMatchingArtist(args[0]),
  "createPlaylist" : args => createPlaylist(args[0], args[1], args.slice(3, args.length)),
  "removeArtist" : args => removeArtist(args[0]),
  "removeAlbum" : args => removeAlbum(args[0]),
  "removeTrack" : args => removeTrack(args[0]),
  "removePlayList" : args => removePlayList(args[0]),
  "searchByName" : args => searchByName(args[0])
}

function main() {
  //console.log('arguments: ');
  //let args2 = process.argv.forEach(argument => console.log(argument));

  try{
    commands[process.argv[2]](process.argv.slice(3, process.argv.length))
  }catch(e){
    throw new InvalidCommandException("El comando " + process.argv[2] + " no existe")
  }

  /*
  switch(args[2]){
    case "addArtist": //Modo de uso: node main.js addArtist artistName artistCountry
      let artistData = {name: args[3], country: args[4]}
      addArtist(artistData)
      break
    case "addAlbum": //Modo de uso: node main.js addAlbum artistId albumName year
      let albumData = {name: args[4], year: args[5]}
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
      console.log(getTrackById(args[3]))
      break
    case "getPlaylistById":
      //Llamar a la funcion del caso.
    case "getTracksMatchingGenres":
      //Llamar a la funcion del caso.
    case "getTracksMatchingArtist":
      //Llamar a la funcion del caso.
    case "createPlaylist":
      //Llamar a la funcion del caso.
    case "removeArtist":
      console.log(removeArtist(args[3]))
      break
    default:
      
  }*/
}


main();
