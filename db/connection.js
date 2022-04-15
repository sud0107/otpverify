const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true
}).then(() => {
    console.log("Database is connected !!")
}).catch(err => {
    console.log("Ohh no error ", err )
}) 