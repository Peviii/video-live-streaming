/**o servidor de streaming ainda esta em implementação */
const express = require('express');
const fs = require('fs');
const path = require('path');
const HLS = require('hls-server');

const app = express();
const directory = 'src/segments';
// const server = new HLS(app, {
//   dir: 'src/playlist',
//   path: directory,  
// });

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/hls/:streamId.m3u8', (req, res) => {
    const streamId = req.params.streamId;
    const playlistPath = path.join(directory, `${streamId}.m3u8`);
    const playlist = fs.readFileSync(playlistPath, 'utf-8');
    res.setHeader('Content-Type', 'application/x-mpegURL');
    res.send(playlist);
});
app.get('/hls/:streamId/:segment', (req, res) => {
    const streamId = req.params.streamId;
    const segment = req.params.segment;
    const segmentPath = path.join(directory, streamId, segment);
    const segmentData = fs.readFileSync(segmentPath);
    res.setHeader('Content-Type', 'video/MP2T');
    res.send(segmentData);
});

new HLS(app, {
  provider: {
    exists: (req, cb) => {
      const exit = req.url.split('.').pop();
      if (exit !== 'm3u8' && exit !== 'ts') return cb(null, true);

      fs.access(__dirname + req.url, fs.constants.F_OK, () => {
        if (error) {
          console.log('file does not exist.');
          return cb(null, false);
        }
        cb(null, true);
      });
    },
    getManifestStream: (req, cb) => {
      const stream = fs.createReadStream(__dirname + req.url);
      cb(null, stream);
    },
    getSegmentStream: (req, cb) => {
      const stream = fs.createReadStream(__dirname + req.url);
      cb(null, stream);
    }
  }
});

app.listen(3000, console.log('running on localhost:3000'));
