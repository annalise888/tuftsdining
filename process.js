var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var port = process.env.PORT || 3000;
const mongo = require('mongodb');
const { MongoClient } = mongo.MongoClient;
const url = process.env.MONGODB_URI;



http.createServer(function (req, res) {
	if (req.url == "/") {
		file = 'form.html';
		fs.readFile(file, function(err, txt) {
			if (err) {return console.log(err); }
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(txt);
		});
	} else if (req.url == "/process") {
		res.writeHead(200, {'Content-Type':'text/html'});
		pdata = "";
		req.on('data',data => {
			pdata += data.toString();
		});
		req.on('end',()=> {
			res.write("1");
			pdata = qs.parse(pdata);
			MongoClient.connect(url,{useUnifiedTopology:true},function(err, db) {
				res.write("2");
				if (err) {
					return console.log("err");
				}
				res.write("3");
				var dbo = db.db("tuftsdining");
				var coll = dbo.collection("menu");
				res.write("4");
				
				getFood(pdata['foodname'],coll);
				res.write("5");
				
				setTimeout(function(){ db.close(); console.log("Success!");}, 5000);
				
			})
			res.end();
		});
	} else {
		res.writeHead(200, {'Content-Type':'text/html'});
		res.write("Unknown page request");
		res.end();
	}
	
	
	setTimeout(function(){res.end();}, 3000);

}).listen(port);

//takes in a string of a food name and collection as a parameter and then searches menu databse for if that food is being served, if so print out when
function getFood(foodName, coll) {
    var query = {food:{$regex : ".*" + foodName + ".*"}}
    
    var sendstring = "";
    coll.find(query).toArray(function(err,items) {
        if (err) {
           res.write("Error: " + err);
        } else if (items.length == 0) {
            res.write("No food being served with that name.");
        } else {
            for (i=0; i < items.length; i++) {
                //console.log(items[i].food + " is being served at " + items[i].hall + " on " + items[i].longdate);
                sendstring += (items[i].food + " is being served at " + items[i].hall + " on " + items[i].longdate + " \n") ;
                //console.log(sendstring);
            }
        }
        
        res.write(sendstring);
        sendmail(sendstring)

    })
    
}

var nodemailer = require('nodemailer');

function sendmail(sendstring) {
    
    

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cpekowsky@gmail.com',
        pass: 'stinkfart101'
      }
    });

    var mailOptions = {
      from: 'cpekowsky@gmail.com',
      to: 'cpekowsky@gmail.com',
      subject: 'foods being served',
      text: sendstring
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    
}

