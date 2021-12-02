const mongoose = require('mongoose');


const EmployeeSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Employees', EmployeeSchema);