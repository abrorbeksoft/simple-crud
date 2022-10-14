const jwt = require("jsonwebtoken")
const privateKey = "shhhhh"


const middleware = (req, resp, next) => {
    const header = req.headers["authorization"] || ""

    const arry = header.split(" ")

    try {
       let user = jwt.verify(arry[1], privateKey)
        req.user = user
        next()
    } catch (err) {
        resp.json({
            "code": "403",
            "message": "Token error"
        })
    }
}

module.exports = middleware
