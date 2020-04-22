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
}

module.exports = Playlist