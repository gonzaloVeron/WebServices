class Artist{
    constructor(name, id, country){
        this._name = name
        this._id = id
        this._country = country
        this._albums = new Set()
    }

    addAlbum(album){
        this._albums.add(album)
    }

}

module.exports = Artist