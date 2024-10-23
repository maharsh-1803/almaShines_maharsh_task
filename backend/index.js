const mongoose = require('mongoose');
const express = require('express');
const app = express();
const env = require('dotenv');
env.config();
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoutes = require('./routes/user.routes')
const urlRoutes = require('./routes/url.routes')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT;


const connectToMongoDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_CONNECT);
        console.log("mongoDB connected");
    } catch (error) {
        console.log(error)
    }
}


app.listen(PORT,async()=>{
    await connectToMongoDB();
    console.log(`server is running on ${PORT}`);
})

app.use('/api/user',userRoutes)
app.use('/',urlRoutes)