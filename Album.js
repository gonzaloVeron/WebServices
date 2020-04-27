class Album{
  constructor(name, id, year, artist){
    this._name = name;
    this._id = id;
    this._year = year;
    this._artist = artist;
    this._tracks = [];
  }

  addTrack(track){
    this._tracks.unshift(track); 
  } 

  removeTrack(track){
    this._tracks.splice(this._tracks.indexOf(track), 1);
  }

  get name(){return this._name;}
  get id(){return this._id;}
  get year(){return this._year;}
  get artist(){return this._artist;}
  get tracks(){return this._tracks;}
}

module.exports = Album;