var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var port = process.env.PORT || 3000;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = "mongodb+srv://annalisejacobson:annalise@cluster0.0y4mi.mongodb.net/tuftsdining?retryWrites=true&w=majority";

http.createServer(function (req, res) {
	if (req.url == "/") {
		file = 'form.html';
		fs.readFile(file, function(err, txt) {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(txt);
			res.end();
		});
	} else if (req.url == "/process") {
		res.writeHead(200, {'Content-Type':'text/html'});
		pdata = "";
		req.on('data',data => {
			pdata += data.toString();
		});
		req.on('end',()=> {
			pdata = qs.parse(pdata);
			MongoClient.connect(url,{useUnifiedTopology:true},function(err, db) {
				if (err) {
					console.log("Connection err: " + err);
				}
        var dbo = db.db("tuftsdining");
        var coll = dbo.collection("menu");
        
        getFood(pdata['foodname'],coll);

        setTimeout(function(){ db.close(); console.log("Success!");}, 1000);
        
			})
			res.end();
		});
	} else {
		res.writeHead(200, {'Content-Type':'text/html'});
		res.write("Unknown page request");
		res.end();
	}
}).listen(port);

