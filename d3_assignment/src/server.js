var express = require("express");
var path = require('path');
var app = express();

app.use("/public", express.static("public"));
app.use("/", express.static('./'));
app.use(express.static('./'));

app.listen(3333, function() {
    console.log("D3 Virtualization app listening on port 3333!");
});