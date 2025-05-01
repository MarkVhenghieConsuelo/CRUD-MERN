// SERVER

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


//PORT NUMBER
const PORT = process.env.PORT || 8080;
//PORT NUMBER

// Database connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Database is connected"))
.catch(err => console.log("Database connection error: ", err));
// Database connection

//Database Schema
const schemaData = mongoose.Schema({
    name: String,
    email: String,
    phone: Number
},
{
    timestamps: true
});
//Database Schema

//MODEL
const userModel = mongoose.model("user", schemaData);
//MODEL

//API ENDPOINTS//

// - READ ALL
app.get("/get", async(req, res) => {
    const data = await userModel.find({});
    res.json({
        success: true,
        data : data
    })
});

// - CREATE
app.post("/create", async(req, res) => {
    const data = new userModel(req.body);
    await data.save();
    res.send({
        success: true,
        message: "User saved successfully!",
        data : data
    });
});

// - UPDATE
app.put("/update", async(req, res) => {
    const { id,...rest} = req.body;
    const data = await userModel.updateOne(
        { _id : id}, 
        rest
    );
    res.send({
        success: true,
        message: "Data updated successfully",
        data: data
    })
});

// - DELETE
app.delete("/delete/:id", async(req, res) => {
    const id = req.params.id;
    const data = await userModel.deleteOne({_id: id});
    res.send({
        success: true,
        message: "Deleted user succesfully!",
        data: data
    })
});

//API ENDPOINTS//


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});