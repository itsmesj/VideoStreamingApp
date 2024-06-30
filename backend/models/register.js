const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileType: {
        type: String,
        default: 'standard'
    },
    gender: {
        type: String,
        required: true
    }
});

const RegisterModel = mongoose.model("registration", RegisterSchema);

module.exports = RegisterModel;
