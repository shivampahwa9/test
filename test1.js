var fs = require( 'fs' );
var readline = require( 'readline' );
const http = require( "http" );
var pattern = require( "matches" ).pattern;
var url = require( 'url' );
const logger = require( './logging' );
// var parse = require('parse');


let httpoptions = {
    hostname: "172.31.14.172",
    port: "5036",
    path: "/getChartImage",
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    requestCert: false,
    rejectUnauthorized: false,
    checkServerIdentity: function (host, cert) {
        if (host != cert.subject.CN) return "checkServerIdentity: mismatched:" + host;
    }
};


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
                logger.info( "Parsing Request" );
                var req = http.request( httpoptions, function (res) {
                    res.on( 'data', function () {
                        logger.info("Recieved Hello from 5036")
                        response.write( "Completed Cycle" );
                    } );
                    res.on( 'end', function () {
                        logger.info("Ending Intial Request")
                        response.end();
                    } );
                    res.on( 'error', (err) => {
                        response.statuscode = 400;
                        response.end( "NOT OK" );
                        console.error( err.stack );
                    } );
                } );
                logger.info( "Sending 'Hi' Message to 5036" );
                req.write( JSON.stringify( {"hello": "hi"} ) );
                req.end();

            }
        },
        '_': function () {
            response.statuscode = 404;
            response.end( 'No such endpoint\n' );
        }
    } );
    requestMap( pathname )
};

/**
 * Create Http Server
 */
const server = http.createServer( requesthandler );
server.listen( 5035, (err) => {
    if (err) {
        return logger.info( 'Something bad Happened, hey you! look After it after me', err )
    }
    logger.info( 'server is listening on port #', 5035 )
} );
