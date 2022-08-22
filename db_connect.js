const mongoose = require("mongoose")

async function getConnect(){
    try{
        await mongoose.connect(process.env.DBKEY || "mongodb://localhost:27017/crud")
        console.log("DataBase is Connected!!!!")
    }
    catch(error){
        console.log(error)
    }
}
getConnect()



// const mongoose = require("mongoose")

// mongoose.connect("mongodb://localhost:27017/crud") // this returns a promise
// .then(()=>{
//     console.log("DataBase is Connected!!!");
// })
// .catch((error)=>{
//     console.log(error)
// })
