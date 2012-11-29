var util = require('util'),
    twitter = require('ntwitter'),
    growl = require('notify-send');

var nconf = require('nconf');

nconf.argv()
    .env()
    .defaults({});

var conkey = nconf.get('consumer_key');
var consec = nconf.get('consumer_secret');
var acckey = nconf.get('access_token_key');
var accsec = nconf.get('access_token_secret');

var twit = new twitter({
    consumer_key: conkey,
    consumer_secret: consec,
    access_token_key: acckey,
    access_token_secret: accsec
});

twit.verifyCredentials(function (err, data) {
    if ( !err ) {
	console.log(data);
    } else {
	console.log("FAILED TO VERIFY :"+util.inspect(err));
	}
});

twit.stream('user', {}, function(stream) {
    stream.on('data', function (data) {
	console.log(data);
	if ( data.user ) {
	    growl.notify('@'+data.user.screen_name+' ('+data.user.name+') says: '+data.text,'');
	}
    });
    stream.on('end', function (response) {
	// Handle a disconnection
	growl.notify('twitcler lost the connection to twitter');
    });
    stream.on('destroy', function (response) {
	// Handle a 'silent' disconnection from Twitter, no end/error event fired
	growl.notify('twitcler silently lost the connection to twitter');
    });
    // Disconnect stream after five seconds
    //setTimeout(stream.destroy, 5000);
});
/*
twit.stream('statuses/sample', function(stream) {
  stream.on('data', function (data) {
    console.log('=================\n'+util.inspect(data));
  });
});
*/
