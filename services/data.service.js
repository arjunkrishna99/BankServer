// import jsonwebtoken
const jwt = require("jsonwebtoken");

// import databse
const db=require('./db')

//database
database = {
  1000: {
    acno: 1000,
    uname: "Neer",
    password: 1000,
    balance: 5000,
    transaction: []
  },
  1001: {
    acno: 1001,
    uname: "Laisha",
    password: 1001,
    balance: 3000,
    transaction: []
  },
  1002: {
    acno: 1002,
    uname: "Vyom",
    password: 1002,
    balance: 4000,
    transaction: []
  },
};
 // register-
 const register=(uname,acno,password)=>
 {
   // asynchronous
   return db.User.findOne({acno})
   .then(user=>{
     if(user){

       // already existing acno
       return{
         statusCode:401,
         status:false,
         message:"Account number already exist"
       }
     }
     else{
       const  newUser=new db.User({
       // add details in to db
         acno,
         uname,
         password,
         balance:0,
         transaction:[]
       
   })
   newUser.save()
     // status 200 cases
     return{
       statusCode:200,
       status:true,
       message:"Sucessfully Registered"
     } 
   }
 })

    
 }
// login

const login = (acno, pswd) => {
  if (acno in database) {
    if (pswd == database[acno]["password"]) {
      currentUser = database[acno]["uname"];
      currentAcno = acno;
      //   token generate
      const token = jwt.sign(
        {
          currentAcno: acno,
        },
        "supersecret123456789"
      );
      // already exust in database
      return {
        statusCode: 200,
        status: true,
        message: " Login Succesful ",

        currentAcno,
        currentUser,
        token,
      };
    } else {
      return {
        statusCode: 422,
        status: false,
        message: "Incorrect password",
      };
    }
  } else {
    return {
      statusCode: 401,
      status: false,
      message: "user doesnt exist",
    };
  }
};

// deposit
const deposit = (req, acno, pswd, amt) => {
  var amount = parseInt(amt);
  if (acno in database) {
    if (pswd == database[acno]["password"]) {
      database[acno]["balance"] += amount;
      database[acno]["transaction"].push({
        type: "CREDIT",
        amount: amount,
      });
      // console log(database)
      return {
        statusCode: 200,
        status: true,
        message:
          amount +
          "successfully deposited and new balance is:" +
          database[acno]["balance"],
      };
    } else {
      alert("incorrect password");
      return {
        statusCode: 422,
        status: false,
        message: "Incorrect password",
      };
    }
  } else {
    return {
      statusCode: 401,
      status: false,
      message: "user doesnt exist",
    };
  }
};

// withdraw
const withdraw = (req, acno, pwd, amt) => {
  var amount = parseInt(amt);
  console.log(acno + "acno in withdraw");

  return db.User.findOne({ acno, password: pwd }).then((user) => {
    if (req.currentAcno != acno) {
      console.log(req.currentAcno + "currentAcno in withdraw");
      return {
        statuscode: 422,
        status: false,
        message: "operation denied!!!",
      };
    }

    if (user) {
      if (user.balance > amount) {
        user.balance -= amount;
        user.transaction.push({
          type: "debit",
          amount: amount,
        });
        //console.log(database);
        user.save();
        return {
          statuscode: 200,
          status: true,
          message:
            amount +
            "succesfully debited.. and new balance is :" +
            user.balance,
        };
      } else {
        return {
          statuscode: 401,
          status: false,
          message: "Insufficient balance!!!",
        };
      }
    } else {
      return {
        statuscode: 401,
        status: false,
        message: "Invalid credentials!!!!",
      };
    }
  });
};

// transaction
const transaction = (acno) => {
  if (acno in database) {
    return {
      statusCode: 200,
      status: true,
      transaction: database[acno].transaction,
    };
  } else {
    return {
      statusCode: 401,
      status: false,
      message: "user doesnt exist",
    };
  }
};

//   export
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  transaction,
};
