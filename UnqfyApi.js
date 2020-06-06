const express = require('express');
const artistMod = require('./controllers/artistController');
const albumMod = require('./controllers/albumController');
const trackMod = require('./controllers/trackController');
const playlistMod = require('./controllers/playlistController');
const bodyParser = require('body-parser');

const artistController = new artistMod.ArtistController();
const albumController = new albumMod.AlbumController();
const trackController = new trackMod.TrackController();
const playlistController = new playlistMod.PlaylistController();

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

router.route('/artists').post(artistController.addArtist).get(artistController.searchArtist);
router.route('/artist/:id').get(artistController.getArtistById).patch(artistController.updateArtistById).delete(artistController.deleteArtistById);

router.route('/albums').post(albumController.addAlbum).get(albumController.searchAlbum);
router.route('/albums/:id').get(albumController.getAlbumById).patch(albumController.updateAlbum).delete(albumController.deleteAlbum);

router.get('/tracks/:id/lyrics', trackController.getLyrics);

router.route('/playlists').post(playlistController.createPlaylist).get(playlistController.searchPlaylist);
router.route('/playlists/:id').get(playlistController.getPlaylistById).delete(playlistController.deletePlaylistById);

app.use('/api', router);

app.get('*', (req, res) => {
  res.status(404);
  res.json({
    status: 404,
    errorCode: 'RESOURCE_NOT_FOUND'
  }); 
});

app.listen(7000);