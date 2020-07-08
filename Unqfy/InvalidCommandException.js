class InvalidCommandException extends Error{
  constructor(message){
    super(message);
  }
}

module.exports = InvalidCommandException;