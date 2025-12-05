if(process.env.NODE_ENV  !== "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js")
const Review = require("./models/review.js");
const {reviewSchema} = require("./schema.js")

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"            // DB name is wanderlust

const dbUrl = process.env.ATLASDB_URL

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};




main()
.then(res => console.log("Connected to DB"))
.catch(err => console.log(err))

async function main(){
    await mongoose.connect(dbUrl);
}

app.listen(port , ()=>{
    console.log("Server is started and is listening on port",port);
});

// app.get("/",(req,res)=>{
//     res.send("Hi , this is root directory")
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser",async (req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "Kush2"
//     });

//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter)


app.all("/*splat",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((req,res,next) => next(new ExpressError(404, 'Page not found')));


app.use((err,req,res,next)=>{
    let {statusCode = 500,message="Something Went Wrong!"}= err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("Error.ejs",{message})
})

// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the Beach",
//         price: 100,
//         location: "Chicago",
//         country: "USA"
//     });

//     await sampleListing.save();
//     console.log("Sample Was Saved");

//     res.send("Successful Testing")
    
// })