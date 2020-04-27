class NonExistentArtistException extends Error{
  constructor(message){
    super(message);
  }
}

module.exports = NonExistentArtistException;