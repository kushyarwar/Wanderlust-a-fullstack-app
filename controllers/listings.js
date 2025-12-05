const Listing = require("../models/listing.js");

// ❌ REMOVE: const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// ❌ REMOVE: const mapToken = process.env.MAP_TOKEN;
// ❌ REMOVE: const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// ✅ ADD THIS:
const axios = require('axios');


module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings })
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id).populate({ path: "reviews", populate: "author" }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exists!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    // let {title,description,price,image,location,country} = req.body;

    // await Listing.insertOne({title:title,description:description,price:price,image:image,location:location,country:country})



    // let listing = req.body.listing
    // console.log(req.body.listing);

    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send some valid listing data");
    // }

    // 1. Get the address user typed
    let location = req.body.listing.location;

    // 2. Call OpenStreetMap (Nominatim) API to get coordinates
    // We use User-Agent header because OSM requires it
    let response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`, {
        headers: {
            'User-Agent': 'Wanderlust-App-Student-Project' 
        }
    });

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // 3. Save Coordinates (GeoJSON format: [Longitude, Latitude])
    // Mapbox does this automatically, but for OSM we do it manually:
    if (response.data.length > 0) {
        let lat = response.data[0].lat;
        let lon = response.data[0].lon;
        
        newListing.geometry = { 
            type: 'Point', 
            coordinates: [parseFloat(lon), parseFloat(lat)] 
        };
    } else {
        // Fallback if location is nonsense (save as 0,0)
        newListing.geometry = { 
            type: 'Point', 
            coordinates: [0, 0] 
        };
    }

    let savedListing = await newListing.save();
    console.log(savedListing);
    

    req.flash("success", "New Listing Added!");
    res.redirect("/listings");

}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exists!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")

    res.render("listings/edit.ejs", { listing , originalImageUrl});
}

module.exports.updateListing = async (req, res) => {

    if (!req.body.listing) {
        throw new ExpressError(400, "Send some valid listing data");
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };

        await listing.save();
    }


    req.flash("success", "Listing Updated!");

    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;

    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);

    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
}