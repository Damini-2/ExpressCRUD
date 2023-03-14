const express = require("express")
const hbs = require("hbs")
const path = require("path")
const bodyParser = require("body-parser")
const dotenv=require("dotenv")
dotenv.config()

require("./db_connect") // all lines of code of this file will be written in this line 
const Employee = require("./models/Employee") // we are requiring this file like this because we don't want the whole file code, whenever we want whatever we want... will require it at that time

const app = express()

const encoder = bodyParser.urlencoded()

app.use(express.static(path.join(__dirname,"views")))
app.set("view engine","hbs")
hbs.registerPartials(path.join(__dirname,"views/partials"))

hbs.registerHelper('idTrim', function (data) {
    data = JSON.parse(JSON.stringify(data))
    //console.log(data);
    return data.slice(-5); 
});

hbs.registerHelper('ifCond', function (v1, v2) {
    if (v1 === v2)
        return `<input type='radio' class='form-check-input' name=gender value='${v2}' checked>${v2}`
    else
        return `<input type='radio' class='form-check-input' name='gender' value='${v2}'>${v2}`
});


app.get("/",async(req,res)=>{
    try{
        const finddata = await Employee.find()
        res.render("index",{datakey:finddata, show: false, message: "" })
    }
    catch(error){
        res.status(500).send("Internal Server Error")
    }
})
app.get("/add",(req,res)=>{
    var data = {
        name:"",
        email:"",
        phone:"",
        dsg:"",
        salary:"",
        gender:"Male",
        city:"",
        state:""
    }
    res.render("add",{show:false,datakey:data,message:""})
})
app.post("/add",encoder,async(req,res)=>{
      var recdata = {}
    try{
        recdata = new Employee(req.body)
        await recdata.save()
        const record = await Employee.find()
        res.render("index", { datakey: record, show: true, message: "Record inserted!!!!!" })
    }
    catch(error){
        if(error.errors.name)
        res.render("add",{show:true,datakey:recdata,message:error.errors.name.message})
        else if(error.errors.email)
        res.render("add",{show:true,datakey:recdata,message:error.errors.email.message})
        else if(error.errors.phone)
        res.render("add",{show:true,datakey:recdata,message:error.errors.phone.message})
        else if(error.errors.dsg)
        res.render("add",{show:true,datakey:recdata,message:error.errors.dsg.message})
        else if(error.errors.salary)
        res.render("add",{show:true,datakey:recdata,message:error.errors.salary.message})
        else
        res.render("add",{show:true,datakey:recdata,message:"Something Went Wrong"})
    }
})

app.get("/delete/:_id", async (req, res) => {
    //await Employee.deleteOne({ _id: req.params._id })

    res.redirect("/")
})
app.get("/update", async (req, res) => {
    const datarec = await Employee.findOne({ _id: req.query._id })
    res.render("update",{show:false,datakey: datarec })
})
app.post("/update", encoder, async (req, res) => {
    const bodydata = await Employee.findOne({ _id: req.query._id })
    bodydata.name = req.body.name
    bodydata.email = req.body.email
    bodydata.phone = req.body.phone
    bodydata.dsg = req.body.dsg
    bodydata.gender = req.body.gender
    bodydata.city = req.body.city
    bodydata.state = req.body.state
    bodydata.salary = req.body.salary
    await bodydata.save()

    const record = await Employee.find()
    res.render("index", { datakey: record, show: true, message: "Record Updated!!!!!!!!" })
})
app.post("/search", encoder, async (req, res) => {
    try {
        const searchdata = await Employee.find({
            $or: [
                { name: { $regex: '.*' + req.body.searchdata + '.*', $options: 'i' } },
                { dsg: { $regex: '.*' + req.body.searchdata + '.*', $options: 'i' } },
                { city: { $regex: '.*' + req.body.searchdata + '.*', $options: 'i' } },
                { state: { $regex: '.*' + req.body.searchdata + '.*', $options: 'i' } },
                { gender: { $regex: '.*' + req.body.searchdata + '.*', $options: 'i' } },
                { email: { $regex: '.*' + req.body.searchdata + '.*', $options: 'i' } },
                { phone: { $regex: '.*' + req.body.searchdata + '.*', $options: 'i' } },
            ]
        })
        res.render("index", { datakey: searchdata })
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
})


const PORT =  8000|| process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server is Running at Port ${PORT}...`);
})