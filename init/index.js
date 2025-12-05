const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"            // DB name is wanderlust

main()
.then(res => console.log("Connected to DB"))
.catch(err => console.log(err))

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj)=>({...obj, owner:"6928c4ad724b05ca4c7bf0aa"}));
    await Listing.insertMany(initData.data);
    console.log("Data was Initialized");
    
}

initDB();

