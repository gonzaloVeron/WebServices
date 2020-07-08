class Album{
  constructor(name, id, year, artist){
    this._name = name;
    this._id = id;
    this._year = year;
    this._artist = artist;
    this._tracks = [];
  }

  addTrack(track){
    this._tracks.push(track); 
  } 

  removeTrack(track){
    this._tracks.splice(this._tracks.indexOf(track), 1);
  }

  toJSON(){
    return {
      id: this.id,
      name: this.name,
      year: this.year,
      tracks: []
    };
  }

  get name(){return this._name;}
  get id(){return this._id;}
  get year(){return this._year;}
  get artist(){return this._artist;}
  get tracks(){return this._tracks;}
  set name(value) {return this._name = value;}
  set year(value) {return this._year = value;}
}

module.exports = Album;