const  HttpError = require ('../models/http-error');

const {v4:uuidv4} = require('uuid');

const getCoordsForAddress= require('../util/location')

const Place = require('../models/places')

const {validationResult}= require('express-validator')

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description:'One of the most  famous sky Scrapers in the world!',
        location:{
            lat: 40.784474, 
            lng: -73.9871516
        },
        address:'20 W 34th st, NewYork, NY 10001',
        creator:'u1'
    }
];

const  getPlaceById = async (req, res,next)=>{
    const placeId =req.params.pid;
    let place;
try{
     place = await Place.findById(placeId)
}catch(err){
const error = new HttpError('Something went wrong,could not find aplace',500);
return next(error)
}
    
    if(!place) {
    const error =   new HttpError('could not find a place  for the  provider id.',404); 
    return next(error);
    }
      res.json({place:place.toObject({getters: true}) });
    
};

const getPlacesByUserId = async(req, res, next)=>{
    const userId = req.params.uid;
    let places
    try{
         places =await Place.find({creator:userId})
    }catch(err){
   const error =new  HttpError(
    'Fetching places failed, please try again',500);
    return next(error)
    }
 
    if(!places||places.length===0) {
       return next 
       (new HttpError('could not find  places  for the  provider user id.',404));
        } 

    res.json({  places:places.map(place=>place.toObject({getters: true})) });
};

const createPlace = async (req,res,next) => {
  const errors =  validationResult(req);
  if(!errors.isEmpty()){
      return next( new HttpError('Invalid inputs passed, places check your data.',422));
  }
 const {title, description,  address, creator} = req.body;

 let coordinates;
 try{ 
    coordinates = await getCoordsForAddress(address);
}catch(error){

    return next(error);
 }

 const  createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFile%3AEmpire_State_Building_%2528HDR%2529.jpg&psig=AOvVaw1pBPU3l1P4lpA1wCJwhGOB&ust=1678899432811000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCJj67vPx2_0CFQAAAAAdAAAAABAE",
    creator
 })
 try{
    await createdPlace.save();
 }catch(err){
const error =new HttpError('Creating place failed, please try again.',500);
return next(error);
 }

 res.status(201).json({place: createdPlace})
};

const updatePlace = async (req, res, next)=>{
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
      throw new HttpError('Invalid inputs passed, places check your data.',422)
    }
    const {title, description} = req.body; 
    const placeId =req.params.pid;

    let place;
    try{
        place= await Place.findById(placeId)

    }catch(err){
        const error = new HttpError('something went wrong',500);
        return next(error);

    }

    place.title=title;
    place.description=description;

try{
await place.save()
}catch(err){
const error = new HttpError('something went wromg, could not place.',500);
return next(error);
}
    res.status(200).json({place: place.toObject({ getters: true})});

}

const deletePlace = async(req, res, next)=>{
  const  placeId = req.params.pid;

 let place;
try{
place = await Place.findById(placeId);
} catch (err){
const error = new HttpError('something went wrong, could not be delete a place', 500);
return next(error);
}
try{
        await place.remove();
}catch(err){
    const error = new HttpError('something went wrong', 500);
    return next(error);
}
    res.status(200).json({message:'Deleted place.'})

}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;

exports.createPlace = createPlace;

exports.updatePlace = updatePlace;

exports.deletePlace = deletePlace;