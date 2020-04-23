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

    removeTrack(track){
        this._tracks.delete(track)
    }

    get name(){return this._name}
    get id(){return this._id}
    get year(){return this._year}
    get artist(){return this._artists}
    get tracks(){return this._tracks}
}

module.exports = Album