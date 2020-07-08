class MissingDataException extends Error{
  constructor(message){
    super(message);
  }
}
  
module.exports = MissingDataException;