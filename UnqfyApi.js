const express = require('express');
const artistController = require('./controllers/artistController');
const albumController = require('./controllers/albumController');
const trackController = require('./controllers/trackController');
const playlistController = require('./controllers/playlistController');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

router.route('/artists').post(artistController.addArtist).get(artistController.searchArtist);
router.route('/artists/:id').get(artistController.getArtistById).put(artistController.updateArtistById).delete(artistController.deleteArtistById);

router.route('/albums').post(albumController.addAlbum).get(albumController.searchAlbum);
router.route('/albums/:id').get(albumController.getAlbumById).patch(albumController.updateAlbum).delete(albumController.deleteAlbum);

router.get('/tracks/:id/lyrics', trackController.getLyrics);

router.route('/playlists').post(playlistController.createPlaylist).get(playlistController.searchPlaylist);
router.route('/playlists/:id').get(playlistController.getPlaylistById).delete(playlistController.deletePlaylistById);

app.use('/api', router);

app.get('/*', (req, res) => {
  res.status(404);
  res.json({
    status: 404,
    errorCode: 'RESOURCE_NOT_FOUND'
  }); 
});

app.listen(7000);
console.log('Servidor corriendo en puerto 7000');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
