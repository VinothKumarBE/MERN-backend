//const axios = require('axios');
//const HttpError =require('../models/http-error')



async function getCoordsForAddress(address){

     return{
        lat:40.784474,
        lng: -73.9871516
     };



//    const response= await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${API_KEY}`);
//    const data= response.data;

//    if(!data || data.status === 'ZERO_RESULTS'){
//     const error  = new HttpError('could not find location for the specifeied address', 422);
//     throw error;
//    }
//    const coordinates = data.results[0].geometry.location;
//    return coordinates
}
module.exports = getCoordsForAddress
