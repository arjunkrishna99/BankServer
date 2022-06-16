// databse connection

// import mongoose
const mongoose=require('mongoose')

// connection string to connect db with server
mongoose.connect('mobgodb://localhost:27017/BankServer',{
    useNewUrlParser:true
}
)

// create model inorder to do operations btw bankserver and databse
mongoose.model('User',
{
        acno: Number,
        uname: String,
        password: String,
        balance: Number,
        transaction: []
      
})

module.exports={
    User
}