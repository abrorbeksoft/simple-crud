const users = []
const books = []

const express = require("express");
const app = express();
const port = 3000;
const bcrypt = require("bcrypt")

const {v4} = require('uuid');

const router = express.Router();
const jwt = require("jsonwebtoken");

const privateKey = "shhhhh"

const auth = require("./app/index")

router.get('/', function (req, res) {
    res.json({"name": "Abrorbek"})
})

app.use(express.json())
app.use(express.urlencoded({extended: true}));

router.post("/register", function (req, res) {
    console.log("Registering...")

    let {login, password} = req.body;

    if (!(login && password)) {
        res.status(400).send("All input is required");
        return
    }

    bcrypt.hash(password, 8).then(resp => {
        let user = {
            "id": v4(),
            "login": login,
            "password": resp,
        }

        users.push(user)

        let token = jwt.sign(user, privateKey);

        res.json({"token": token, "message": "Login successful"});
    })
});


router.post("/login", function (req, res) {

    const {login, password} = req.body;

    if (!(login && password)) {
        res.status(400).send("All input is required");
        return
    }

    let user = users.find((e) => {
        return e.login === login
    })

    if (!user) {
        res.json({"code": 403, "message": "Login or password incorrect"});
        return
    } else {
        bcrypt.compare(password, user.password).then(res => {
            if (!res) {
                res.json({"code": 403, "message": "Login or password incorrect"});
                return
            }
        })
    }

    let token = jwt.sign(user, privateKey);

    res.json({"token": token, "message": "Login successful"});
});

router.post("/book", auth, (req, resp) => {
    const {name, auth_name} = req.body

    let book = {
        "id": v4(),
        "name": name,
        "auth_name": auth_name,
    }
    books.push(book)
    resp.json(book)
})

router.get("/book/:id", auth, (req, resp) => {
    const {id} = req.params

    let book = books.find(elem => {
        return elem.id === id
    })

    if (!book) {
        resp.json({
            "code": 500,
            "message": "Book not exists"
        });
        return
    }

    resp.json(book)
})


router.get("/book", auth, (req, resp) => {
    resp.json(books)
})

router.put("/book/:id", auth, (req, resp) => {
    const {name, auth_name} = req.body
    const {id} = req.params

    let index = books.findIndex(elem => {
        return elem.id === id
    })

    if (!index) {
        resp.json({
            "code": 500,
            "message": "Book not exists"
        });
        return
    }

    books[index] = {
        "id":id,
        "name" : name,
        "auth_name" : auth_name
    }

    resp.json(books[index])
})


app.use("/api", router)

app.listen((port), function () {
    console.log("listening on port " + port);
});