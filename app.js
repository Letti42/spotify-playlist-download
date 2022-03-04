var lol = [];
var spapi = ''; //Put the token in here
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi();


spotifyApi.setAccessToken(spapi);
var yt = require('youtube-search-without-api-key');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const ytdl = require('ytdl-core');

//When you share a playlist, put the beginning id in the quotes below
//ex: https://open.spotify.com/playlist/5v0HKRugGvVgmzq6GpZLYC?si=c60d470f91e1431e
//This is id for that playlist: 5v0HKRugGvVgmzq6GpZLYC
spotifyApi.getPlaylistTracks('5v0HKRugGvVgmzq6GpZLYC') 
.then(function(data) {
    for(var i =0; i < data.body.items.length;i++){
        let artists = '';
        for(var e= 0; e < data.body.items[i].track.artists.length; e++){
            artists += data.body.items[i].track.artists[e].name;
        }
        lol.push(data.body.items[i].track.name +' - '+ artists);
    } 
    //console.log(lol);
    main(lol);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

async function main(arr){
    var lmao = [];
    
    for(var i = 0; i < arr.length; i++){
        var videos = await yt.search(arr[i]);
        lmao.push(videos[0].snippet.url)
        console.log(arr[i]);
    }
    fs.writeFileSync("yt_urls.txt",lmao.join('\n'));
    fs.writeFileSync("song_names.txt",arr.join('\n'));
    download(lmao.join('\n'),arr.join('\n'));
}


function download(yt_urls,song_names){

var datas = yt_urls
var songs = song_names
console.log(datas.split('\n').length);
var urls = datas.split('\n');
ffmpegSong(0);
function ffmpegSong(num){
    console.log(urls[num].split('?v=')[1]);
    ffmpeg(ytdl(urls[num].split('?v=')[1], { quality: 'lowestaudio', }))
        .save(`./audio/${songs.split('\n')[num]}.mp3`)
        .on('end',()=>{
            console.log('Done dummy');
            num!=urls.length -1?ffmpegSong(num+1):console.log('Done with all');
        })
        .on('error',(err)=>{
            console.log(err);
        });
}
}






