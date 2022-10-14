
const users = []

const express  = require("express");
const app = express();
const port = 3000;

const router = express.Router();

router.get('/', function (req, res){
    res.json({ "name":"Abrorbek"})
})

router.get("/login", function (req, res){

});



router.get("/register", function (req, res){


    res.json(req.body)

//    user =  users.find((elem)=>{
//     return elem.login === req.
//     })
});

app.use("/api", router)

app.listen((port), function() {
    console.log("listening on port " + port);
});