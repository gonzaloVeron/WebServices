const ExistException = require('./ExistException');

class Artist{
  constructor(name, id, country, obs){
    this._name = name;
    this._id = id;
    this._country = country;
    this._albums = [];
    this._observador = obs;
  }

  addAlbum(album){
    if(this.albums.some(a => a.name === album.name)){
      throw new ExistException('Ya existe un album con nombre: '+ album.name);
    }
    this._observador.cambie(this.id, this.name, album.name);
    this._albums.push(album);
  }

  removeAlbum(album){
    this._albums.splice(this._albums.indexOf(album), 1);
  }

  tracks(){
    return this._albums.flatMap(a => a.tracks);
  }

  toJSON(){
    return {
      id: this.id,
      name: this.name,
      country: this.country,
      albums: this.albums
    };
  }

  agregarObs(obs){
    this._observador = obs;
  }

  get name(){return this._name;}
  get id(){return this._id;}
  get country(){return this._country;}
  get albums(){return this._albums;}
  set id(value){return this._id = value;}
  set country(value){return this._country = value;}
  set name(value){return this._name = value;}

}

module.exports = Artist;