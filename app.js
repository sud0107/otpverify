const express = require("express");
const router = require("./userRouter/usercontroller")
const app = express();
require("dotenv").config();
require("./db/connection");


app.use(express.json());

app.use("/api", router);





const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})