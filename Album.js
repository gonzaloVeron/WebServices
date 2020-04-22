class Album{
    constructor(name, id, year, artist){
        this._name = name
        this._id = id
        this._year = year
        this._artist = artist
        this._tracks = new Set()
    }

    addTrack(track){
        this._tracks.add(track)
    }
}

module.exports = Album