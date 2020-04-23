class Playlist{
    constructor(name){
        this._name = name
        this._tracks = new Set()
        this._genres = new Set()
    }

    hasTrack(st){
        return this._tracks.has(st)
    }

    addGenre(genre){
        this._genres.add(genre)
    }

    addTrack(track){
        this._tracks.add(track)
    }

    calculateDuration(){
        let dur = 0
        this._tracks.forEach(t => {
            dur += t.duration
        })
        return dur
    }

    get name(){return this._name}
    get tracks(){return this._tracks}
    get genres(){return this._genres}
}

module.exports = Playlist