const {v4:uuidv4} = require('uuid');
const  HttpError = require ('../models/http-error');
const {validationResult} = require('express-validator')
const DUMMY_USERS=[{
id:'u1',
name:'Vinoth',
email:'vino123@gmail.com',
password:'Vino@123'

}]
const getUsers =(req, res,next) =>{
    res.json({users: DUMMY_USERS})
    
};

const signup = (req, res, next) =>{
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
      throw new HttpError('Invalid inputs passed, places check your data.',422)
    }
    const{name, email, password }= req.body;

    const hasUser = DUMMY_USERS.find(u=> u.email ===email);
    if(hasUser){
        throw new HttpError('Could not create  user, email already exists.',422)
    
    }

    const createdUser ={
        id: uuidv4(),
        name,
        email,
        password
    };
DUMMY_USERS.push(createdUser);

res.status(201).json({user:createdUser})

};

const login=(req, res,next) =>{

    const {email, password} =req.body;

    const identifierUser = DUMMY_USERS.find(u =>u.email===email)
    if(!identifierUser ||identifierUser.password !== password){
        throw new HttpError('Could not identify  user, credential seems to be wrong.',401)

    }
  res.json({message:'Looged in!'});

};

exports.getUsers=getUsers;
exports.signup= signup;
exports.login = login;