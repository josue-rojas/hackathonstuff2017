// ----------------------- node stuff --------------------
var express = require('express');
const { Pool } = require('pg') //postgres
var parser = require('body-parser');
const app = express();
const fileUpload = require('express-fileupload');
var path = require('path');

// ----------------------- setup ------------------------
app.use(express.static( "public/" ));
app.use(parser.json());
app.use(fileUpload());
app.set('view engine', 'ejs')
var connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: connectionString,
})
//

var spawn = require('child_process').spawn,
   py    = spawn('python', ['compute_input.py']),
   data = [1,2,3,4,5,6,7,8,9],
   dataString = '';

// create table if none
// pool.query("CREATE TABLE IF NOT EXISTS opportunities(id SERIAL UNIQUE PRIMARY KEY, city text NOT NULL,  major text NOT NULL, ethinicity text NOT NULL, gender text NOT NULL, age INTEGER  NOT NULL, link text NOT NULL)")
//
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, $1, $2, $3, $4, $5, $6)', ["All", "All", "African", "All", 0, "http://www.nsbe.org/"])
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, $1, $2, $3, $4, $5, $6)', ["All", "All", "All", "All", 0, "http://www.jackierobinson.org/"])
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, $1, $2, $3, $4, $5, $6)', ["All", "All", "Asian", "All", 0, "http://www.apiasf.org/scholarships.html"])
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, $1, $2, $3, $4, $5, $6)', ["All", "All", "Hispanic", "All", 0, "http://www.utsahsa.org/"])
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, $1, $2, $3, $4, $5, $6)', ["All", "All", "Hispanic", "All", 0, "http://www.alpfa.org/"])
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, $1, $2, $3, $4, $5, $6)', ["All", "All", "Asian", "All", 0, "https://stanfordaasa.weebly.com/"])
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, $1, $2, $3, $4, $5, $6)', ["All", "All", "Asian", "All", 0, "http://www.naacp.org/naacp-scholarships/"])
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, $1, $2, $3, $4, $5, $6)', ["All", "All", "Indian", "All", 0, "http://www.aises.org/"])



// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, "All", "All", "All", "All", 0, "http://www.jackierobinson.org/")')
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, "All", "All", "Asian", "All", 0, "http://www.apiasf.org/scholarships.html")')
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, "All", "All", "Hispanic", "All", 0, "http://www.shpe.org/")')
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, "All", "All", "Hispanic", "All", 0, "http://www.utsahsa.org/")')
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, "All", "All", "Hispanic", "All", 0, "http://www.alpfa.org/")')
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, "All", "All", "Asian", "All", 0, "https://stanfordaasa.weebly.com/")')
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, "All", "All", "Asian", "All", 0, "http://www.naacp.org/naacp-scholarships/")')
//
// pool.query('INSERT INTO opportunities(id, city, major, ethinicity, gender, age, link) values(DEFAULT, "All", "All", "Indian", "All", 0, "http://www.aises.org/")')


// ----------------------- routes -----------------------
// ALL ROUTES WITH QUERY NEEDS TO BE CHECKED IF IT WAS SUCCESSFUL
app.get('/', (req, res, next) => {
  res.render('home')
})

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.image;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('face.jpg', function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

app.get('/opportunies/q', (req,res) =>{
  // name =  !req.query.name ? '' : "name='"+req.query.name+"'"
  city =  !req.query.city ? '' : "city='"+req.query.city+"'"
  major =  !req.query.major ? '' : "major='"+req.query.major+"'"
  ethinicity =  !req.query.ethnicity ? '' : "ethinicity='"+req.query.ethnicity+"'"
  gender =  !req.query.gender ? '' : "month='"+req.query.gender+"'"
  age =  !req.query.age ? '' : "age='"+req.query.age+"'"
  // image =  !req.query.image ? '' : "image='"+req.query.image+"'"
  newQuery = [city, major, ethinicity, gender, age].filter(function(w){return w.length > 0}).join(' and ')
  console.log(newQuery)

  newQuery =  newQuery.length < 1 ? 'SELECT link FROM opportunities' : 'SELECT link FROM opportunities WHERE ' + newQuery
  pool.query(newQuery)
  .then(results =>{
    console.log(results.rows)
    res.end(JSON.stringify(results.rows))
  })
  .catch(e => console.error(e.stack))
})


py.stdout.on('data', function(data){
  dataString += data.toString();
});

/*Once the stream is done (on 'end') we want to simply log the received data to the console.*/
py.stdout.on('end', function(){
  console.log('Sum of numbers=',dataString);
});

py.stdin.write(JSON.stringify(data));

py.stdin.end();

// ----------------------- start -----------------------
app.listen(process.env.PORT);
console.log('listening on port '+process.env.PORT)
