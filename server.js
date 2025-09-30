require("dotenv").config();
const express = require("express");
const { connectMongoDB } = require("./src/config/configMongoDB");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const PORT = process.env.PORT;

const app = express();

const allowedOrigins = [
  "http://localhost:5173",   // Vite
  "http://localhost:7000",   // CRA
  "https://lighthearted-muffin-50f551.netlify.app",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());


app.use((req, res, next)=>{
    console.log("hit api");
    next();
})

app.use("/v1",require("./src/route/v1/apiRoute"));




(async()=>{
    try{
         await connectMongoDB();
         console.log("connected to mongoDB");
         app.listen(PORT,'0.0.0.0',()=>{console.log(`server is running on ${PORT}`)});
    }catch(err){
        console.log("connection to mongoDB is failed.")
    }
})()

