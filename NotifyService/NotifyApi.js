const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./errorHandler');
const NotifyController = require('./NotifyController');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/api', router);

router.route('/subscribe').post(NotifyController.subscribe);

router.route('/unsubscribe').post(NotifyController.unsuscribe);

router.route('/notify').post(NotifyController.notify);

router.route('/subscriptions').delete(NotifyController.deleteSubscriptionsByArtistId).get(NotifyController.getSubscriptionsByArtistId);;

app.use((req, res) => {
  res.status(404);
  res.json({
    status: 404,
    errorCode: 'RESOURCE_NOT_FOUND'
  }); 
});

app.use(errorHandler);

app.listen(6000);
console.log('Servidor corriendo en puerto 6000');
