const express = require("express");
const app = express();
// const users = require("./routes/users.js");
// const posts = require("./routes/posts.js");
// const cookieParser = require("cookie-parser");

const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.use(session({secret: "mysupersecretstring", saveUninitialized: true, resave: false}));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("Success");
    res.locals.errorMsg = req.flash("Error");
    next();
})


app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    
    if (name === "anonymous") {
        req.flash("Error","User Not Registered.")
    } else {
        req.flash("Success","User Registered Successfully.")
    }
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name: req.session.name});
})

// app.get("/reqcount",(req,res)=>{
//     if (req.session.count){
//         req.session.count++;
//     } else{
//         req.session.count = 1;
//     }

//     res.send(`You sent a request ${req.session.count} times.`)
// })

// app.get("/test",(req,res)=>{
//     res.send("Test Successful!");
// });

// app.use(cookieParser("secretcode"));

// app.get("/",(req,res)=>{
//     res.send("Root");
// })

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("madeIn","USA");
//     res.cookie("name","kush");
//     res.send("Cookies page");
// })

// app.get("/greet",(req,res)=>{
//     let {name = "anonymous"} = req.cookies;
//     console.dir(req.cookies);
//     res.send(`hii,${name}`);
// })

// app.get("/signedcookie",(req,res)=>{
//     res.cookie("Made-In","India",{signed: true});
//     res.send("Signed cookies sent")
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("Verified")
// });

// app.use("/users",users);
// app.use("/posts",posts);

app.listen(3000,()=>{
    console.log("Server listening on 3000");
})