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
					res.write("Connection err: " + err);
				}
				var dbo = db.db("tuftsdining");
				var coll = dbo.collection("menu");

				var foods = getFood(pdata['foodname'],coll);
				res.write(foods);
				
				res.end();

				setTimeout(function(){ db.close(); console.log("Success!");}, 5000);
				
			})
			
		});
	} else {
		res.writeHead(200, {'Content-Type':'text/html'});
		res.write("Unknown page request");
		res.end();
	}
}).listen(port);

function getFood(foodName, coll) {
	var query = {food:{$regex : ".*" + foodName + ".*"}}
	var str = "";
	coll.find(query).toArray(function(err,items) {
		if (err) {
			str = "Error: " + err;
		} else if (items.length == 0) {
			str = "No food being served with that name.";
		} else {
			for (i=0; i < items.length; i++) {
				str += (items[i].food + " is being served at " + items[i].hall + " on " + items[i].longdate + "<br>");
			}
		}
	})
	res.write(str);
	return str;
}

