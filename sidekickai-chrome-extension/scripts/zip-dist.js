const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const dist = path.resolve(__dirname, '..', 'dist');
const out = path.resolve(__dirname, '..', 'sidekickai-dist.zip');
if (!fs.existsSync(dist)) { console.error('dist not found'); process.exit(1); }
const output = fs.createWriteStream(out);
const archive = archiver('zip', { zlib: { level:9 }});
output.on('close', ()=> console.log('zip done'));
archive.pipe(output);
archive.directory(dist, false);
archive.finalize();
