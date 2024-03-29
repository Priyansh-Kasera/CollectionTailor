const mongoose = require('mongoose');

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URI)
            .then((data)=>{
                console.log(`Mongodb connected to server data : ${data.connection.host}`)
            }).catch((err)=>{
                console.log(err)
            })
}

module.exports = connectDatabase;
