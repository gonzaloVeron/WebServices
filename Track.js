const rp = require('request-promise');

class Track {
  constructor(name, id, album, artist, genres, duration){
    this._name = name;
    this._id = id;
    this._album = album;
    this._artist = artist;
    this._genres = genres;
    this._duration = duration;
    this._lyrics = '';
  }

  get name(){return this._name;}
  get id(){return this._id;}
  get album(){return this._album;}
  get artist(){return this._artist;}
  get genres(){return this._genres;}
  get duration(){return this._duration;}

  requestOptions(uri, qs){
    qs.apikey = '39c9374e5b988a015380147641a30056';
    const BASE_URL = 'http://api.musixmatch.com/ws/1.1';
    const options = {
      uri: BASE_URL + uri,
      qs: qs,
      json: true,
    };
    return options;
  }
  
  getTrackIdMusixMatch(){
    return rp.get(this.requestOptions('/track.search', {q_track: this.name})).then(response => {
      return response.message.body.track_list[0].track.track_id;
    });
  }

  getLyrics(){
    if(this._lyrics === ''){
      return this.getTrackIdMusixMatch().then(trackId => {
        return rp.get(this.requestOptions('/track.lyrics.get', {track_id: trackId,})).then(response => {
          this._lyrics = response.message.body.lyrics.lyrics_body;
          return this._lyrics;
        });
      });
    }
    return this._lyrics;
  }
  
  toJSON(){
    return {
      name: this.name,
      lyrics: this.getLyrics()
    };
  }

}

module.exports = Track;