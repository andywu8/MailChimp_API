const bodyParser= require("body-parser");
const express= require("express");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
    const firstName=req.body.fName;
    const lastName=req.body.lName;
    const email = req.body.email;
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName 
                }

            }
        ]
    };
    const jsonData= JSON.stringify(data);
    // 17 is from us 17 on line 46
    const url = "https://us17.api.mailchimp.com/3.0/lists/54600cf5ed";
    const options = {
        method: "POST", 
        auth: "andy1:e59c2e9870c4873180104cadfe0adb63-us17"
    }

    const request = https.request(url, options, function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end()

    console.log("hello! " + firstName + " " + lastName + " and your email is  " + email);
});

app.post("/failure", function(req, res){
    res.redirect("/")
})


app.listen(process.env.PORT || 3000,function(){
    console.log("server is runnning at port ");
});
// app.listen(3000, function(){
//     console.log("server is running on port 3000");
// });



// e59c2e9870c4873180104cadfe0adb63-us17    
// audience id: 54600cf5ed