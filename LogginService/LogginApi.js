const express = require('express');
const bodyParser = require('body-parser');
const LogginController = require('./LogginController');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/api', router);
router.route('/activate').post(LogginController.activate);
router.route('/desactivate').post(LogginController.desactivate);
router.route('/log').post(LogginController.log);
router.route('isAlive').get(LogginController.isAlive);

app.use((req, res) => {
  res.status(404);
  res.json({
    status: 404,
    errorCode: 'RESOURCE_NOT_FOUND'
  }); 
});

app.listen(5000);
console.log('Servidor corriendo en puerto 5000');
