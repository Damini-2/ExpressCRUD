const mongoose = require("mongoose")

//Schema is defined to tell the table structure
const EmployeeSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Employee Name Required"]
    },
    email:{
        type:String,
        required:[true,"Email ID Required"]
    },
    phone:{
        type:String,
        required:[true,"Phone number Required"]
    },
    dsg:{
        type:String,
        required:[true,"Designation Required"]
    },
    salary:{
        type:Number,
        required:[true,"Salary Required"]
    },
    gender:{
        type:String,
        required:[true,"Gender Required"]
    },
    city:{
        type:String
    },
    state:{
        type:String
    }
})
const Employee = new mongoose.model("Employee",EmployeeSchema)
// model() function provides functions of database to operate with records in mongo db like search, find
module.exports = Employee