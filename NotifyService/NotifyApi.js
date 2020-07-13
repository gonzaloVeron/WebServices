const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./errorHandler');
const SubscriptionController = require('./SubscriptionController');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/api', router);

router.route('/subscribe').post(SubscriptionController.subscribe);

router.route('/unsubscribe').post(SubscriptionController.unsubscribe);

router.route('/notify').post(SubscriptionController.notify);

router.route('/subscriptions').delete(SubscriptionController.deleteSubscriptionsByArtistId).get(SubscriptionController.getSubscriptionsByArtistId);

router.route('isAlive').get(SubscriptionController.isAlive);

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
