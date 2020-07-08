class NonExistentException extends Error{
  constructor(message){
    super(message);
  }
}

module.exports = NonExistentException;