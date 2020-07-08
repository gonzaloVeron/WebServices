const express = require('express');
const artistController = require('./controllers/artistController');
const albumController = require('./controllers/albumController');
const trackController = require('./controllers/trackController');
const playlistController = require('./controllers/playlistController');
const userController = require('./controllers/userController');
const bodyParser = require('body-parser');
const errorHandler = require('./errorHandler');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/api', router);

router.route('/artists').post(artistController.addArtist).get(artistController.searchArtist);
router.route('/artists/:id').get(artistController.getArtistById).put(artistController.updateArtistById).delete(artistController.deleteArtistById);

router.route('/albums').post(albumController.addAlbum).get(albumController.searchAlbum);
router.route('/albums/:id').get(albumController.getAlbumById).patch(albumController.updateAlbum).delete(albumController.deleteAlbum);

router.route('/tracks/:id').post(trackController.addTrack);
router.route('/tracks/:id/lyrics').get(trackController.getLyrics);

router.route('/playlists').post(playlistController.createPlaylist).get(playlistController.searchPlaylist);
router.route('/playlists/:id').get(playlistController.getPlaylistById).delete(playlistController.deletePlaylistById);

router.route('/user').post(userController.addUser);
router.route('/user/:id').get(userController.getUserById).delete(userController.deleteUser).put(userController.updateUser);
router.route('/user/:userId/:trackId').get(userController.getTimesHeard).post(userController.hear);
router.route('/user/mostHeard/:userId/:artistId').get(userController.getMostHeard);

app.use((req, res) => {
  res.status(404);
  res.json({
    status: 404,
    errorCode: 'RESOURCE_NOT_FOUND'
  }); 
});

app.use(errorHandler);

app.listen(7000);
console.log('Servidor corriendo en puerto 7000');
