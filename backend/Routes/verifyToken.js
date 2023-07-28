const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // from the frontend we are grabbing the authorization header
    // frontend will be setting the token and we are grabbing it in backend  and checking it
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        // verification
        jwt.verify(token, process.env.JWT_SEC_KEY, (err, user) => {
            if (err) return res.status(403).json("Token is not valid...");
            // if valid token then we are gonna assign user to request
            req.user = user;
            next(); // proceed to next step of the function
        })
    } else {
        // token doesn't exist
        return res.status(401).json("Acess Denied !! You are not Authrnticated...");
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        //first we will decide whether this token belong to client/admin or not
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that !!");
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        //first we will decide whether this token belong to client/admin or not
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that !!");
        }
    })
}
module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };