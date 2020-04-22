class Artist{
    constructor(name, id, country){
        this._name = name
        this._id = id
        this._country = country
        this._albums = []
    }

    addAlbum(album){
        this._albums.unshift(album)
    }

}

module.exports = Artist