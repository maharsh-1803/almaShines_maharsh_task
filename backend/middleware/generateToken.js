const jwt = require('jsonwebtoken');

const generateToken = async ({ _id }) => {
    try {
        const payload = { _id };
        const token = await jwt.sign(payload,process.env.SECRET_KEY, { expiresIn: '10d' });
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Token generation failed");
    }
};

module.exports = generateToken;
    