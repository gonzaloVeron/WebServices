class Playlist{
  constructor(id, name, genres, maxDuration){
    this._id = id;
    this._name = name;
    this._tracks = [];
    this._genres = genres;
    this._maxDuration = maxDuration;
  }

  hasTrack(track){
    return this._tracks.some(t => t.name === track.name);
  }

  addGenre(genre){
    this._genres.unshift(genre);
  }

  addTrack(track){
    if(track.duration < this.maxDuration){
      this._tracks.unshift(track);
    }
  }

  removeTracks(tracks){
    tracks.forEach(t => this.removeTrack(t));
  }

  removeTrack(track){
    this._tracks.splice(this._tracks.indexOf(track), 1);
  }

  duration(){
    return this._maxDuration;
  }

  get id(){return this._id;}
  get name(){return this._name;}
  get tracks(){return this._tracks;}
  get genres(){return this._genres;}
  get maxDuration(){return this._maxDuration;}
}

module.exports = Playlist;