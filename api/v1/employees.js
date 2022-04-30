const express = require('express');
const router = express.Router();
const Employee = require('../../models/Employee');
const Joi = require('joi');
const fs = require('fs')

router.get("/" , async (req, res) => {
    try{
        const employees = await Employee.find();
        res.json(employees);
    }catch(err){
        res.json({message: err, success: false})
    }
});

router.post("/" , async (req, res) => {
    const {error} = validateEmployee(req.body)
    if(error) return res.status(400).json({message: error.details[0].message, success: false});

    let count = fs.readFileSync('./models/counter.txt', 'utf8');
    const employee = new Employee({
        id: ++count,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId
    });
    fs.writeFileSync('./models/counter.txt', count.toString())
    
    try{
        const savedEmployee = await employee.save();
        res.json({id: employee.id, message: `Employee added successfully.`, success: true});
    }catch(err){
        res.json({message: err, success: false})
    }
});

router.get("/:id" , async (req, res) => {
    try{
        const employee = await Employee.find({"id": parseInt(req.params.id)});
        res.json(employee);
    }catch(err){
        res.json({message: err, success: false});
    }
});

router.put("/:id" , async (req, res) => {
    const {error} = validateEmployee(req.body);
    if(error) return res.status(400).json({message: error.details[0].message, success: false});
    
    try{
        const updateEmployee = await Employee.updateOne(
            {"id": parseInt(req.params.id)},
            {$set: {firstName: req.body.firstName, 
                    lastName: req.body.lastName, 
                    emailId: req.body.emailId}}
        );
        res.json({message: "Employee update Successfully", success: true});
    }catch(err){
        res.json({message: err, success: false});
    }
});

router.delete("/:id" , async (req, res) => {
    try{
        const removeEmployee = await Employee.remove({"id": parseInt(req.params.id)});
        res.json({message: "Successfully Deleted", success: true});
    }catch(err){
        res.json({message: err, success: false});
    }
});

function validateEmployee(employee){
    const schema = Joi.object({
        firstName: Joi.string()
            .min(3)
            .max(30)
            .required(),
        lastName: Joi.string()
            .min(3)
            .max(30)
            .required(),
        emailId: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required()
    })

    return schema.validate(employee);
}

module.exports = router;