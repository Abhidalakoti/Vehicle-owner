const mongoose = require("mongoose");
const ScooterSchema = new mongoose.Schema({
    name: String,
    model: Number,
    company: String,
    ownerId: String
});
module.exports = mongoose.model("scooter", CarSchema);