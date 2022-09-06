const express = require("express");
const app = express();
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const uploadRoute = require('./routes/upload');
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors")
require('dotenv').config();

//cors
app.use(
    cors({
        origin:"https://main--graceful-shortbread-a3ddd5.netlify.app/",
        methods: ["GET", "POST","DELETE","PUT"],
        credentials:true,
    })
);

// Database Connect
mongoose.connect(process.env.MONGOURL).then(()=>{
    console.log("DB connected !");
}).catch((err)=> {
    console.log(err);
});

let PORT = process.env.PORT;
if(PORT == null || PORT == "") {
    PORT = 5000;
}

// Make Path
app.use("/images",express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);
app.use('/api/upload', uploadRoute);

app.get('/', (req, res) => {
    console.log("Test success");
});

app.listen(PORT, () => console.log("Server Running !"))
console.log("nodejs");  