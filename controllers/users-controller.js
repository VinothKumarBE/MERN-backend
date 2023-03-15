const  HttpError = require ('../models/http-error');
const {validationResult} = require('express-validator');
const User = require('../models/user')

const getUsers = async(req, res,next) =>{
    let users;
    try{
          users =  await User.find({}, '-password')
    }catch(err){
const error = new HttpError('Fetching user failed',500);
return next(error);
    }
      res.json({users: users.map(user  => user.toObject({getters: true }))});
 };



const signup = async (req, res, next) =>{
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
      return next ( new HttpError('Invalid inputs passed, places check your data.',422));
    }
    const{name, email, image, password}= req.body;
    let existingUser
try{
      existingUser =  await User.findOne({email: email})
}catch(err){
  const error = new HttpError('Signinng up fail, please try again',500);
  return next(error);
}
if(existingUser){
    const error = new HttpError(
        'User exist already, please login properly.',422
    );
    return next(error)
}
    const createdUser = new User({
        name,
        email,
        image,
        password,
        places:[]
    });
    
try{
    await createdUser.save();
    }
catch(err){
     const  error = new HttpError(err,500);
     return next(error);
    }
  
     res.status(201).json({user:createdUser.toObject({ getters: true })});

};



const login= async(req, res,next) =>{

    const {email, password} =req.body;

    let existingUser
try{
         existingUser = await User.findOne({email: email})
}catch(err){
        const error = new HttpError('something coming wrong place go back, login error',500);
        return next(error);
    }
    if(!existingUser || existingUser.password !== password){
        const error = new HttpError('In validcredentials, could not log you',401);
        return next(error)
    }

    
  res.json({message:'Looged in!'});

};

exports.getUsers=getUsers;
exports.signup= signup;
exports.login = login;