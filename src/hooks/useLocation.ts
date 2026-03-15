import Geolocation from "@react-native-community/geolocation";

export const getLocation = (setLocation:any)=>{

Geolocation.getCurrentPosition(

(position)=>{
setLocation(position);
},

(error)=>{
console.log(error);
},

{enableHighAccuracy:true}

);

};
