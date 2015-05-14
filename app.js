/**
 * Module dependencies.
 */

var express = require('express'),
    jsdom = require('jsdom'),
    request = require('request'),
    url = require('url'),
    app = module.exports = express.createServer();

// Configuration
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('stylus').middleware({
        src: __dirname + '/public'
    }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res) {
    res.render('index', {
        title: 'Express'
    });
});

app.get('/immo', function(req, res) {
    request({
        uri: 'http://mangastream.com/'
    }, function(err, response, body) {

        var self = this;
        self.items = new Array(); 
        if (err && response.statusCode !== 200) {
            console.log('Request error.');
        }
            jsdom.env({
            html: body,
            scripts: ['http://code.jquery.com/jquery-1.6.min.js']
            }, function(err, window) {
                var $ = window.jQuery,
                $body = $('body'),
                $mangas = $body.find('.active');
           
                $mangas.each(function(i, item) {
                    var $a = $(item).find('a');
                    $title = $a.text();
                    var indextemp = $title.indexOf("One Piece");
                    if (indextemp != -1) {
                    console.log("a-------" + $a);
                    console.log("title-------" + $title);
                };
            });

            console.log(self.items);
            res.render('list', {
                title: 'Is My Manga Out',
                items: self.items
            });
        });
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);