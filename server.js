// ----------------------- node stuff --------------------
var express = require('express');
const { Pool } = require('pg') //postgres
var parser = require('body-parser');
const app = express();
var path = require('path');

// ----------------------- setup ------------------------
app.use(express.static( "public/" ));
app.use(parser.json());
app.set('view engine', 'ejs')
var connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: connectionString,
})

// create table if none
// pool.query("CREATE TABLE IF NOT EXISTS events(id SERIAL UNIQUE PRIMARY KEY, year INTEGER  NOT NULL, monthNum INTEGER NOT NULL, month VARCHAR(255) NOT NULL, day INTEGER NOT NULL, hourStart INTEGER  NOT NULL, minStart INTEGER NOT NULL, hourEnd INTEGER NOT NULL, minEnd INTEGER NOT NULL, priority INTEGER NOT NULL, description text NOT NULL)")

// ----------------------- routes -----------------------
// ALL ROUTES WITH QUERY NEEDS TO BE CHECKED IF IT WAS SUCCESSFUL
app.get('/', (req, res, next) => {
  res.render('home')
})

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('/image.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
    res.send('File uploaded!');
});

// ----------------------- start -----------------------
app.listen(process.env.PORT);
console.log('listening on port '+process.env.PORT)
