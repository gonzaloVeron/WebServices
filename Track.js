class Track{
    constructor(name, id, album, artist, duration){
        this._name = name
        this._id = id
        this._album = album
        this._artist = artist
        this._duration = duration
    }

    get duration(){return this._duration}

}

module.exports = Track