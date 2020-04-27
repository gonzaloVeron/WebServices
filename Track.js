class Track{
  constructor(name, id, album, artist, genres, duration){
    this._name = name;
    this._id = id;
    this._album = album;
    this._artist = artist;
    this._genres = genres;
    this._duration = duration;
  }

  get name(){return this._name;}
  get id(){return this._id;}
  get album(){return this._album;}
  get artist(){return this._artists;}
  get genres(){return this._genres;}
  get duration(){return this._duration;}
}

module.exports = Track;