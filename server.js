var fs = require( 'fs' );
var readline = require( 'readline' );
var google = require( 'googleapis' );
var googleAuth = require( 'google-auth-library' );
var nodemailer = require( 'nodemailer2' );
var smtpTransport = require( 'nodemailer-smtp-transport' );
var xoauth2 = require( 'xoauth2' );
const http = require( "http" );
var pattern = require( "matches" ).pattern;
var url = require( 'url' );
// var parse = require('parse');

/**
 *  Handle the Incoming Request, Currently Supported Request.
 *  endpoint -> /sendMail
 * @param request
 * @param response
 */
const requesthandler = (request, response) => {
    var pathname = url.parse( request.url ).pathname;
    var iq = url.parse( request.url, true ).query.q

    var requestMap = pattern( {
        '"/getChartImage"': function () {
            if (request.method == 'POST') {
                var body = '';
                request.on( 'data', function (data) {
                    body += data;
                    if (body.length > 1e6)
                        request.connection.destroy();
                } );

                request.on( 'end', function () {
                    console.log( JSON.parse( body ) );
                    fs.readFile("/Users/lalitlakhotia/Desktop/lalit/Verdis_Os/email-msa-test/mailer folder/mfolder/images/1.PNG", function(err, data){
                        //response.writeHead(200, {'Content-Type': 'text/html'});
                        response.write(data);
                        response.end();
                    });
                    response.statuscode = 200;
                    response.end( "OK" );
                } );
            }
        },
        '_': function () {
            response.statuscode = 404;
            response.end( 'No such endpoint\n' );
        }
    } );
    console.log( pathname + " " + iq );
    requestMap( pathname )
};

/**
 * Create Http Server
 */
const server = http.createServer( requesthandler );
server.listen( 5035, (err) => {
    if (err) {
        return console.log( 'Something bad Happened, hey you! look After it after me', err )
    }
    console.log( 'server is listening on port #', 5036 )
} );