class User{
  constructor(id, name){
    this._id = id;
    this._name = name;
    this._songsHeard = [];
  }

  hear(track){
    if(this.songsHeard.map(obj => obj.trackName).includes(track.name)){
      this.songsHeard.find(obj => obj.trackName === track.name).timesHeard++;
    }else{
      this.songsHeard.unshift({trackName: track.name, artistName: track.artist.name, timesHeard: 1});
    }
  }

  whatSongsHeard(){
    return this.songsHeard.map(obj => obj.trackName);
  }

  timesHeard(trackName){
    return this.songsHeard.find(obj => obj.trackName === trackName).timesHeard;
  }

  mostHeard(artistName){
    return this.songsHeard.sort((x, y) => y.timesHeard - x.timesHeard).filter(obj => obj.artistName === artistName).slice(0, 3);
  }

  toJSON(){
    return {
      id: this.id,
      name: this.name,
      songsHeard: this.songsHeard
    };
  }

  get id(){return this._id;}
  get name(){return this._name;}
  get songsHeard(){return this._songsHeard;}

  set name(newName){return this._name = newName;}
}

module.exports = User;