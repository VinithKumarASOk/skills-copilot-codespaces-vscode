// Create web server
// Create the web server
// Load the 'http' module
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var comments = [];
var server = http.createServer(function(req, res) {
    // Parse the request URL
    var urlObj = url.parse(req.url, true);
    // Get the path of the requested file
    var filePath = '.' + urlObj.pathname;
    // Check if the file exists
    fs.exists(filePath, function(exists) {
        if (exists) {
            // Read the file
            fs.readFile(filePath, function(err, data) {
                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('Error loading ' + filePath);
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    res.end(data);
                }
            });
        } else {
            // Check if the requested URL is the comments service
            if (urlObj.pathname === '/comments') {
                // Check the request method
                if (req.method === 'POST') {
                    // Read the data
                    var postData = '';
                    req.on('data', function(chunk) {
                        postData += chunk;
                    });
                    req.on('end', function() {
                        // Add the comment to the comments array
                        comments.push(JSON.parse(postData));
                        // Return the comments array
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        });
                        res.end(JSON.stringify(comments));
                    });
                } else {
                    // Return the comments array
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify(comments));
                }
            } else {
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.end('404 Not Found\n');
            }
        }
    });
});
// Listen on port 3000
server.listen(3000, function() {
    console.log('Server listening on