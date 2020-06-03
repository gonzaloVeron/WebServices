

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy

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

function addUser(userName){
  const unquify = getUNQfy();
  unquify.addUser(userName);
  saveUNQfy(unquify);
}

function hear(userId, trackId){
  const unquify = getUNQfy();
  unquify.hear(userId, trackId);
  saveUNQfy(unquify);
}

function songsHeard(userId){
  console.log(getUNQfy().getUserById(userId).whatSongsHeard());
}

function timesHeard(userId, trackId){
  console.log(getUNQfy().timesHeard(userId, trackId));
}

function mostHeard(userId, artistId){
  console.log(getUNQfy().mostHeard(userId, artistId));
}

function addArtist(artistData){
  const unquify = getUNQfy();
  try{
    unquify.addArtist(artistData);
  } catch(e){
    console.log(e.message);
  }
  
  saveUNQfy(unquify);
}

function addAlbum(artistId, albumData){
  const unquify = getUNQfy();
  try{
    unquify.addAlbum(artistId, albumData);
  } catch(e){
    console.log(e.message);
  }
  saveUNQfy(unquify);
}

function addTrack(albumId, trackData){
  const unquify = getUNQfy();
  try{
    unquify.addTrack(albumId, trackData);
  } catch(e){
    console.log(e.message);
  }
  saveUNQfy(unquify);
}

function getArtistById(id) {
  console.log(getUNQfy().getArtistById(id));
}

function getAlbumById(id) {
  console.log(getUNQfy().getAlbumById(id));
}

function getTrackById(id) {
  console.log(getUNQfy().getTrackById(id));
}

function getPlaylistById(id){
  console.log(getUNQfy().getPlaylistById(id));
}

function removeArtist(artistId){
  const unquify = getUNQfy();
  unquify.removeArtist(artistId);
  saveUNQfy(unquify);
}

function removeAlbum(albumId){
  const unquify = getUNQfy();
  unquify.removeAlbum(albumId);
  saveUNQfy(unquify);
}

function removeTrack(trackId){
  const unquify = getUNQfy();
  unquify.removeTrack(trackId);
  saveUNQfy(unquify);
}

function removePlayList(playListId){ 
  const unquify = getUNQfy();
  unquify.removePlayList(playListId);
  saveUNQfy(unquify);
}

function searchByName(st){
  console.log(getUNQfy().searchByName(st));
}

function getTracksMatchingGenres(genres){
  return console.log(getUNQfy().getTracksMatchingGenres(genres));
}

function getTracksMatchingArtist(artistName){
  return console.log(getUNQfy().getTracksMatchingArtist(artistName));
}

function createPlaylist(name, genresToInclude, maxDuration) {
  const unquify = getUNQfy();
  unquify.createPlaylist(name, genresToInclude, maxDuration);
  saveUNQfy(unquify);
}

function getUserById(userId){
  console.log(getUNQfy().getUserById(userId))
}

/* --- */

function getAlbumsForArtist(artistName){
  console.log(getUNQfy().getAlbumsForArtist(artistName)); 
}

function populateAlbumsForArtist(artistName){
  const unquify = getUNQfy();
  unquify.populateAlbumsForArtist(artistName).then(() => saveUNQfy(unquify));
}

const commands = {
  getUserById : args => getUserById(parseInt(args[0])),
  mostHeard : args => mostHeard(parseInt(args[0]), parseInt(args[1])),
  timesHeard : args => timesHeard(parseInt(args[0]), parseInt(args[1])),
  songsHeard : args => songsHeard(parseInt(args[0])),
  hear : args => hear(parseInt(args[0]), parseInt(args[1])),
  addUser : args => addUser(args[0]),
  addArtist : args => addArtist({name : args[0], country : args[1]}),
  addAlbum : args => addAlbum(parseInt(args[0]),{name : args[1], year : parseInt(args[2])}),
  addTrack : args => addTrack(parseInt(args[0]), {name : args[1], duration : parseInt(args[2]), genres : args.slice(3, args.length)}), 
  getArtistById : args => getArtistById(parseInt(args[0])),
  getAlbumById : args => getAlbumById(parseInt(args[0])),
  getTrackById : args => getTrackById(parseInt(args[0])),
  getPlaylistById : args => getPlaylistById(parseInt(args[0])),
  getTracksMatchingGenres : args => getTracksMatchingGenres(args),
  getTracksMatchingArtist : args => getTracksMatchingArtist(args[0]),
  createPlaylist : args => createPlaylist(args[0], args.slice(3, args.length), parseInt(args[1])),
  removeArtist : args => removeArtist(parseInt(args[0])),
  removeAlbum : args => removeAlbum(parseInt(args[0])),
  removeTrack : args => removeTrack(parseInt(args[0])),
  removePlayList : args => removePlayList(parseInt(args[0])),
  searchByName : args => searchByName(args[0]),
  getAlbumsForArtist : args => getAlbumsForArtist(args[0]),
  populateAlbumsForArtist : args => populateAlbumsForArtist(args[0]),
};

function main() {
  if(commands[process.argv[2]] !== undefined){
    commands[process.argv[2]](process.argv.slice(3, process.argv.length));
  } else {
    console.log('El comando ' + process.argv[2] + ' no existe');
  }
}

main();
