/*
Caleb Pekowsky 5/28/21

This program scrapes the next week's menus of Carmichael and Dewick Dining hall  
and sends the info to a database. 


General strategy: 
- calculates the dates of the next week 
-adds this to the site URL to get the right day's menu 
- scrapes correct day's menu's foods into an array
- sends all of those foods in the array to a server. 
*/

const axios = require('axios');



//creates all URLS for the dining halls 
//takes in the the modified URL of the current hall you want to get info from, and that halls name
async function weekdates(currURL, hall) {
    
    //gets the current next weeks dates 
    var days = [];
    var months = [];
    var years = [];
    
    var today = new Date();
    
    for(var i = 0; i < 7; i ++ ) {
        var currday = new Date();
        currday.setDate(new Date().getDate()+i);
        console.log( "Day: " + currday.getDate() );
        days.push(currday.getDate() );

        console.log( "Month: " + currday.getMonth() );
        months.push(currday.getMonth() +1);

        console.log( "Year: " + currday.getFullYear() );
        years.push(currday.getFullYear() );


    }
    
    console.log( "days: " +days );
    console.log( "months: " + months );
    console.log( "years: " + years );



    
    //For each day in the next week, create the correct URL for that day's menu 
    //and then execute downloadURL on that site.  
    for(var i = 0; i < 7; i++ ) {
        
        newURL = currURL;
        newURL += months[i];
        newURL += '%2f';
        newURL += days[i];
        newURL += '%2f';
        newURL += years[i];

        newURL = newURL.toString();
        
        await downloadURL(newURL, i, hall);
        
    }
        
    
}

//downloads the HTML of a web page 
//takes in the correct URL for the day, i (pointless), and the current hall 
async function downloadURL(myurl, i, hall) {
    
    
    //I don't really understand this, I copied it from the internet. 
    axios( {url: myurl} )
      .then(response => {
        const html = response.data;
        //calls siteparse, which will get the actual foods from the menu.
        return siteparse(html, i, hall);
      })
      .catch(console.error);


    
}


//takes in a super long string of all the html of current file called html 
//also the current day (which is bullshit) and the current hall 
//should return an array of all the foods 
async function siteparse(html, currday, hall) {
    
    //split shenanigans to get the correct info from the site.
    html = html.split("div");
    
    foodlist = [];
    var daydate;
    
    for( i = 0; i < html.length; i ++ ) {
        //console.log(html[i]);
        if( html[i].includes("Menus for") ) {
            daydate = html[i].split("for ");
            daydate = daydate[1];
            daydate = daydate.substring(0, daydate.length - 2);
        }

        if( html[i].includes("shortmenurecipes") ) {
            var food = html[i];
            food = food.split("#000000'>");
            food = food[1];
            
            food = food.split("&nbsp")
            food = food[0];
            console.log(food);
            foodlist.push(food);
        }
    }
    
    //by now foodlist should have all the foods. I then call mongoInsert 
    //on foodlist to insert all these foods into the database. 
    mongoinsert(foodlist, daydate, currday, hall);
    
    
    //console.log("Finished parsing this day.");    

    return foodlist;
}

//takes in array of current days food, daydate which is real current date, numday 
//which is bullshit current day, and current hall 
function mongoinsert(foodlist, daydate, numday, hall) {
    

    //getting the real date 
    
    weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    for(j = 0; j < 7; j ++) {
        if(daydate.includes(weekdays[j]) ) {
            realnumday = j;
        }
    }

    console.log(foodlist);

    console.log("date: " + daydate + " numdate: " + realnumday + " hall: " + hall);

    
    
    //plan: insert a day, and a bunch of items 
    
    
    const MongoClient = require('mongodb').MongoClient;
    const url = "mongodb+srv://user1:caleb@cluster0.0y4mi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        
        console.log(1);

        if(err) { return console.log(err); return;}
        
        console.log(2);


      var dbo = db.db("tuftsdining");
      
      console.log(3);

      
      var collection = dbo.collection('menu2');
      
      console.log(4);

      //insert each thing in the food list in correct template. 
      for(i = 0; i < foodlist.length; i++) {
          //var newData = "{" +" Company: "  + data[i] + "}";
          
          var newData2 = { "longdate" : daydate, "numdate" : realnumday, "hall": hall, "food" : foodlist[i] };
          //console.log(newData2);

          
          collection.insertOne(newData2, function(err, res) {
          if(err) { console.log("query err: " + err); return; }
          console.log("new document inserted");

          }   );
      }
      
      console.log(5);

      
      console.log("Success!");
      
      console.log(6);

      setTimeout(function() { db.close();   console.log("Success!") ;}, 1000);
     
    });


}

//modified URL, the correct day and date will be inserted at the end
const dewickurl = "https://menus.tufts.edu/FoodPro%203.1.NET/shortmenu.aspx?sName=TUFTS+DINING&locationNum=11&locationName=Dewick+Dining+Center&naFlag=1&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=";
const carmurl = "https://menus.tufts.edu/FoodPro%203.1.NET/shortmenu.aspx?sName=TUFTS+DINING&locationNum=11&locationName=Carmichael+Dining+Center&naFlag=1&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=";

weekdates(dewickurl, "Dewick");
console.log("CHANGING DINING HALLS")
weekdates(carmurl, "Carmichael");
