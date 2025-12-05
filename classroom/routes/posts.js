const express = require("express");
const router = express.Router();

// Posts
router.get("/",(req,res)=>{
    res.send("Get for posts")
});

router.get("/:id",(req,res)=>{
    res.send("Get for Posts id")
});

router.post("/",(req,res)=>{
    res.send("Post for posts")
});

router.delete("/:id",(req,res)=>{
    res.send("Delete for posts")
})

module.exports = router;