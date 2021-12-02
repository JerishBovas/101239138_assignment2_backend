const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser')
require('dotenv/config');

app.use(bodyParser.json());
const employeesRoute = require('./api/v1/employees');
app.use('/api/v1/employees', employeesRoute);

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Connected to Database!!");
}).catch(err => {
    console.log("Could not connect to the Database!!");
    process.exit();
})

const port  = process.env.PORT || 9090;
app.listen(port, () => console.log(`listening on port ${port}`))