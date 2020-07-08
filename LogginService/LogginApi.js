const express = require('express');
const bodyParser = require('body-parser');
const LogginController = require('./LogginController');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use('/api', router);

app.use('/activated', LogginController.activate);
app.use('/desactivated', LogginController.desactivate);
app.use('/log', LogginController.log);

app.use((req, res) => {
  res.status(404);
  res.json({
    status: 404,
    errorCode: 'RESOURCE_NOT_FOUND'
  }); 
});

app.listen(5000);
console.log('Servidor corriendo en puerto 5000');
