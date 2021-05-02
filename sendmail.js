
/*


const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = "mongodb+srv://annalisejacobson:annalise@cluster0.0y4mi.mongodb.net/tuftsdining?retryWrites=true&w=majority";
MongoClient.connect(url,{useUnifiedTopology:true},function(err, db) {
    if (err) {
        console.log("Connection err: " + err);
    }
    var dbo = db.db("tuftsdining");
    var coll = dbo.collection("menu");
    
    getFood("Mushroom",coll);
    
    setTimeout(function(){ db.close(); console.log("Success!");}, 1000);
})

//make function that takes in a string of a food name as a parameter and then searches menu databse for if that food is being served, if so print out when
function getFood(foodName, coll) {
    var query = {food:{$regex : ".*" + foodName + ".*"}}
    
    var sendstring = "";
    coll.find(query).toArray(function(err,items) {
        if (err) {
            console.log("Error: " + err);
        } else if (items.length == 0) {
            console.log("No food being served with that name.");
        } else {
            for (i=0; i < items.length; i++) {
                //console.log(items[i].food + " is being served at " + items[i].hall + " on " + items[i].longdate);
                sendstring += (items[i].food + " is being served at " + items[i].hall + " on " + items[i].longdate + " \n") ;
                //console.log(sendstring);
            }
        }
        
        console.log(sendstring);
        sendmail(sendstring)

    })
    
    //console.log(sendstring);

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


*/

