const generateToken = require("../middleware/generateToken.js");
const User = require("../model/user.model.js");
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        const token = await generateToken({ _id: user._id });

        return res.status(200).json({
            data: user,
            token: token,
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid credentials" });
        }

        const token = await generateToken({ _id: user._id });

        return res.status(200).json({
            message: "user logged in successfully",
            token: token,
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports = {
    signUp,
    login
}