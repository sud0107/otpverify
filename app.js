const express = require("express");
const router = require("./Router/userRouter");
const app = express();
require("dotenv").config();
require("./db/connection");


app.use(express.json());

app.use("/api", router);


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Listeing on port", PORT);
})