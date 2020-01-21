const express = require('express');
//var session = require('cookie-session'); // Loads the piece of middleware for sessions
const bodyParser = require('body-parser'); // Loads the piece of middleware for managing the settings

const request = require('request');

const path = require('path');

const port = 8090; //app port

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//fix the cross origin request (CORS) issue
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

//directory to serve static assets
app.use(express.static(__dirname + '/public'));

//app.set('view engine', 'ejs');

app.set('views', './views')

/* Using sessions */
//app.use(session({ secret: 'wmt1ockbtopsecret' }));

// default route
app.get('/home', function(req, res) {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname + '/views/home.html'));
})

// default route
app.get('/', function(req, res) {
    res.send("K-Crush retail front-end app is up and running !!. User /home to get the homepage");
})


/* Redirects to the home page if the page requested is not found */
app.use(function(req, res, next) {
  res.redirect('/');
});


app.set('port', process.env.port || port); // set express to use this port

// set the app to listen on the port
app.listen(port, () => {
  console.log(`Nodejs Server running on port: ${port}`);
  console.log(__dirname + '/views');
});
