const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data){
    let err = {};
    
    data.name = !isEmpty(data.name) ? data.name: "" ;
    data.email = !isEmpty(data.email) ? data.email: "" ;
    data.password = !isEmpty(data.password) ? data.password: "" ;
    data.password2 = !isEmpty(data.password2) ? data.password2: "" ; 

    if(Validator.isEmpty(data.name)){
        err.name = "Name field is required";
    }

    if(Validator.isEmpty(data.email)){
        err.email = "Email field is required";
    }else if(!Validator.isEmail(data.email)){
        err.email = "Email is Invalid";
    }

    if(Validator.isEmpty(data.password)){
        err.password = "Password field is required"; 
    }

    if(Validator.isEmpty(data.password2)){
        err.password2 = "Confirm Password is required";
    }

    if(!Validator.isLength(data.password, {min: 6,max: 30})){
        err.password = "Password must be atleast 6 Characters";
    }

    if(!Validator.equals(data.password,data.password2)){
        err.password="Incorrect Password match";
    }

    return{
        err,
        isValid: isEmpty(err)
    };

};