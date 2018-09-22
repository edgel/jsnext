
var http = require("http"),
    url  = require("url"),
    path = require("path"),
    fs   = require("fs");

http.createServer(function (req, res) {
    var pathname=__dirname+url.parse(req.url).pathname;
    if (path.extname(pathname)=="") {
        pathname+="/";
    }
    if (pathname.charAt(pathname.length-1)=="/"){
        pathname+="index.html";
    }

	try{
		console.log(path.basename(pathname));

		res.writeHead(200, {"Content-Type": "text/html"});

		var data=fs.readFileSync(pathname, "utf-8");
		console.log(data);

		res.end(data);

	}catch(e){
		res.writeHead(404, {"Content-Type": "text/html"});
		res.end("<h1>404 Not Found</h1>");
	}

}).listen(8080, "127.0.0.1");

console.log("Server running at http://127.0.0.1:8080/");
