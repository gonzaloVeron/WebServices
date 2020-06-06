class Artist{
  constructor(name, id, country){
    this._name = name;
    this._id = id;
    this._country = country;
    this._albums = [];
  }

  addAlbum(album){
    this._albums.unshift(album);
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

  get name(){return this._name;}
  get id(){return this._id;}
  get country(){return this._country;}
  get albums(){return this._albums;}
}

module.exports = Artist;