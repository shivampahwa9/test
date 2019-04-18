var fs = require( 'fs' );
var readline = require( 'readline' );
const http = require( "http" );
var pattern = require( "matches" ).pattern;
var url = require( 'url' );
const logger = require( './logging' );
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
                } );
                request.on( 'end', function () {

                    logger.info( "Recieved " , JSON.parse( body ) );
                    response.statuscode = 200;
                    response.end( "Hello" );
                    logger.info( "Sending Hello");
                } );
            }
        },
        '_': function () {
            response.statuscode = 404;
            response.end( 'No such endpoint\n' );
        }
    } );
    logger.info( pathname + " " + iq );
    requestMap( pathname )
};


/**
 * Create Http Server
 */
const server = http.createServer( requesthandler );
server.listen( 5036, (err) => {
    if (err) {
        return logger.info( 'Something bad Happened, hey you! look After it after me', err )
    }
    logger.info( 'server is listening on port #', 5036 )
} );
