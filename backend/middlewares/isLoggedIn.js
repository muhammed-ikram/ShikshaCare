const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next) {

    let token = req.cookies.token;

    // Allow header authentication as well
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const data = jwt.verify(token, "secretkey");
        req.user = data;

        // Map 'id' from token to '_id' for consistency with Mongoose
        if (req.user.id && !req.user._id) {
            req.user._id = req.user.id;
        }

        next();
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = isLoggedIn;