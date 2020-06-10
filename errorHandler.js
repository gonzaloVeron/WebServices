const errores = require('./Exceptions/APIError');

module.exports = (err, req, res, next) => {
  if (err instanceof errores.InvalidInputError){
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});
  } else if (err instanceof errores.ResourceNotFound){
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});
  } else if (err instanceof errores.BadRequest){
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});
  } else if(err instanceof errores.RelatedResourceNotFound){
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});
  } else if (err instanceof errores.ResourseAlreadyExists){
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});
  } else if (err.type === 'entity.parse.failed'){
    res.status(err.status);
    res.json({status: err.status, errorCode: 'BAD_REQUEST'});
  } else {
    res.status(500);
    res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'});
    next(err);
  }
};