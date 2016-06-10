var express = require( 'express' );
var path = require( 'path' );
var app = express();

app.use( '/phaser', express.static( './node_modules/phaser/build' ));
app.use( '/app', express.static( './www' ));
app.get('/', (req, res) => { res.sendFile( path.join( __dirname + '/index.html' )); });

app.listen( 8080 );
console.log( 'listening on http://localhost:8080' );