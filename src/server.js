const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));

app.get('/watch-video', (req, res) => {
  const range = req.headers.range;
  if (!range) res.status(400).send("requires range header");

  const videoPath = "src/interestelar.mp4";
  const videoSize = fs.statSync("src/interestelar.mp4").size;

  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;
  
  const headers = {
    "Content-Range": `bytes ${start} - ${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});
app.get('watch-video/:quality', (req, res) => { //esta rota é um protótipo, ainda em teste e desenvolvimento;
  const range = req.headers.range;
  if (!range) res.status(400).send('requires range header.');

  const videoPath = 'src/interestelar.mp4';
  const videoSize = fs.statSync('sr/interestelar.mp4').size;

  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.main(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;

  const qualityOptions = {
    '144p': '144p-mp4',
    '240p': '240p-mp4',
    '480p': '480p-mp4',
  };

  const quality = req.params.quality || '480p';
  const contentType = qualityOptions[quality] || 'video/480p-mp4';

  const headers = {
    "Content-Range": `bytes ${start} - ${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": contentType,
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});
app.get('/download', (req, res) => {//esta rota ainda será testada;
  const path = fs.createWriteStream(__dirname, 'src/interestelar.mp4');
  res.pipe(path);
  path.on('finish', () => {
    path.close();
    console.log('download completed');
  })
});

app.listen(3000, () => console.log('listening on localhost:3000'));
