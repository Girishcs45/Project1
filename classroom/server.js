const express = require("express");
const app = express();

app.get("/" , (req, res) =>{
    res.send("Hii, welcome to roots place");
});



app.listen(3000,() =>{
    console.log("Server is litening to 3000");
});