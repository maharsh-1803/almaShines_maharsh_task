const jwt = require('jsonwebtoken');

const AuthToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).send({ message: "Token not provided" });
        }
        jwt.verify(token,process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Failed to verify token" });
            }

            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports = AuthToken;
