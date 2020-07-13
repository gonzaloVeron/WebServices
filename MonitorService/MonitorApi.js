const express = require('express');
const bodyParser = require('body-parser');
const MonitorController = require('./MonitorController');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/api', router);

router.route('/unqfy/isAlive').get(MonitorController.unqfyIsAlive);
router.route('/notify/isAlive').get(MonitorController.notifyIsAlive);
router.route('/loggin/isAlive').get(MonitorController.logginIsAlive);
router.route("/activate").post(MonitorController.activate);
router.route("/desactivate").post(MonitorController.desactivate);


app.use((req, res) => {
  res.status(404);
  res.json({
    status: 404,
    errorCode: 'RESOURCE_NOT_FOUND'
  }); 
});

app.listen(4000);
console.log('Servidor corriendo en puerto 4000');