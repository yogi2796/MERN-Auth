const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateLoginInput(data){
    let err ={};

    data.email = !Validator.isEmpty(data.email) ? data.email : "";
    data.password = !Validator.isEmpty(data.password) ? data.password : "";

    if(Validator.isEmpty(data.email)){
        err.email = "Email field is required";
    }else if(!Validator.isEmail(data.email)){
        err.email = "Email is Invalid";
    };

   if(Validator.isEmpty(data.password)){
       err.password = "Passeord field is requird";
   }

   return{
       err,
       isValid : isEmpty(err)
   };
};