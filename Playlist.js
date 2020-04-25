class Playlist{
    constructor(name, genres, maxDuration){
        this._name = name
        this._tracks = []
        this._genres = genres
        this._maxDuration = maxDuration
    }

    hasTrack(st){
        return this._tracks.some(t => t.name === st)
    }

    addGenre(genre){
        this._genres.unshift(genre)
    }

    addTrack(track){ //revisar la duracion
        this._tracks.unshift(track)
    }

    removeTracks(tracks){
        tracks.forEach(t => this.removeTrack(t))
    }

    removeTrack(track){
        this._tracks.splice(this._tracks.indexOf(track), 1)
    }

    duration(){
        return this._tracks.reduce((acum, actual) => acum + actual.duration, 0)
    }

    get name(){return this._name}
    get tracks(){return this._tracks}
    get genres(){return this._genres}
}

module.exports = Playlist