import React, { useState, useEffect } from "react";
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Alert,
Image,
ScrollView
} from "react-native";

import { Camera, useCameraDevice } from "react-native-vision-camera";
import { z } from "zod";

import { getLocation } from "./src/hooks/useLocation";
import { requestCameraPermission } from "./src/hooks/useCamera";

export default function App() {

/* ================= STATES ================= */

const [logged,setLogged]=useState(false);
const [intro,setIntro]=useState(1);
const [isRegister,setIsRegister]=useState(false);
const [mostrarPerfil,setMostrarPerfil]=useState(false);

const [nombre,setNombre]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [confirmPassword,setConfirmPassword]=useState("");

const [token,setToken]=useState("");
const [carrito,setCarrito]=useState<any[]>([]);
const [location,setLocation]=useState<any>(null);
const [mostrarCamara,setMostrarCamara]=useState(false);

const device = useCameraDevice("back");

/* ================= EFFECTS ================= */

useEffect(()=>{
requestCameraPermission();
},[]);

/* ================= API ================= */

const API_URL="http://10.0.2.2:5000";

/* ================= PRODUCTOS ================= */

const productos=[
{
id:1,
nombre:"Blusa Elegante",
precio:18,
imagen:require("./assets/blusa-eleganre.webp")
},
{
id:2,
nombre:"Pantalón Mujer",
precio:30,
imagen:require("./assets/pantalon.jpg")
},
{
id:3,
nombre:"Vestido Floral",
precio:25,
imagen:require("./assets/vestido-floral.webp")
}
];

/* ================= VALIDACION ================= */

const registerSchema=z.object({
nombre:z.string().min(1,"Nombre obligatorio"),
email:z.string().email("Correo no válido"),
password:z.string().min(6,"Mínimo 6 caracteres"),
confirmPassword:z.string()
}).refine((data)=>data.password===data.confirmPassword,{
message:"Las contraseñas no coinciden",
path:["confirmPassword"]
});

const validateRegister=()=>{

const result=registerSchema.safeParse({
nombre,
email,
password,
confirmPassword
});

if(!result.success){
Alert.alert("Error",result.error.errors[0].message);
return false;
}

return true;

};

/* ================= LOGIN ================= */

const login=async()=>{

if(!email||!password){
Alert.alert("Error","Ingrese email y contraseña");
return;
}

try{

const res=await fetch(`${API_URL}/login`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({email,password})
});

const data=await res.json();

if(res.ok){

setToken(data.access_token);
setNombre(data.user.nombre);
setLogged(true);

}else{

Alert.alert("Error",data.message||"Credenciales incorrectas");

}

}catch{

Alert.alert("Error","No se pudo conectar al servidor");

}

};

/* ================= REGISTER ================= */

const register=async()=>{

if(!validateRegister())return;

try{

const res=await fetch(`${API_URL}/register`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
nombre,
email,
password,
rol:"cliente"
})
});

const data=await res.json();

if(res.ok){

Alert.alert("Éxito","Usuario registrado");
setIsRegister(false);

}else{

Alert.alert("Error",data.message);

}

}catch{

Alert.alert("Error","No se pudo registrar");

}

};

/* ================= PERFIL ================= */

const verPerfil=async()=>{

try{

const res=await fetch(`${API_URL}/perfil`,{
method:"GET",
headers:{
Authorization:`Bearer ${token}`
}
});

const data=await res.json();

setNombre(data.nombre);
setEmail(data.email);
setMostrarPerfil(true);

}catch{

Alert.alert("Error","No se pudo obtener perfil");

}

};

/* ================= CARRITO ================= */

const agregarCarrito=(producto:any)=>{

setCarrito([...carrito,producto]);
Alert.alert("Carrito","Producto agregado 💖");

};

const cerrarSesion=()=>{

setLogged(false);
setEmail("");
setPassword("");
setToken("");
setCarrito([]);

};

/* ================= GPS ================= */

const obtenerUbicacion=()=>{
getLocation(setLocation);
};

/* ================= INTRO 1 ================= */

if(intro===1){
return(

<View style={styles.container}>

<Image
source={require("./assets/divamujer.png")}
style={styles.logo}
/>

<Text style={styles.title}>Bienvenida 💖</Text>

<Text style={{textAlign:"center",marginBottom:30}}>
Descubre la moda de Divina Mujer
</Text>

<TouchableOpacity
style={styles.button}
onPress={()=>setIntro(2)}
>
<Text style={styles.buttonText}>Siguiente</Text>
</TouchableOpacity>

</View>

);
}

/* ================= INTRO 2 ================= */

if(intro===2){
return(

<View style={styles.container}>

<Image
source={require("./assets/divamujer.png")}
style={styles.logo}
/>

<Text style={styles.title}>Moda femenina</Text>

<Text style={{textAlign:"center",marginBottom:30}}>
Vestidos, blusas y pantalones elegantes
</Text>

<TouchableOpacity
style={styles.button}
onPress={()=>setIntro(3)}
>
<Text style={styles.buttonText}>Siguiente</Text>
</TouchableOpacity>

</View>

);
}

/* ================= INTRO 3 ================= */

if(intro===3){
return(

<View style={styles.container}>

<Image
source={require("./assets/divamujer.png")}
style={styles.logo}
/>

<Text style={styles.title}>Compra fácil</Text>

<Text style={{textAlign:"center",marginBottom:30}}>
Compra desde tu celular 💖
</Text>

<TouchableOpacity
style={styles.button}
onPress={()=>setIntro(4)}
>
<Text style={styles.buttonText}>Empezar</Text>
</TouchableOpacity>

</View>

);
}

/* ================= APP ================= */

return(

<View style={styles.container}>

{mostrarPerfil ? (

<View style={styles.profileContainer}>

<Image
source={{uri:"https://randomuser.me/api/portraits/women/44.jpg"}}
style={styles.profileImage}
/>

<View style={styles.profileCard}>

<Text style={styles.profileTitle}>
Hola {nombre} 💖
</Text>

<Text style={styles.profileText}>
📧 {email}
</Text>

<Text style={styles.profileText}>
👤 Cliente
</Text>

<TouchableOpacity
style={styles.profileButton}
onPress={()=>setMostrarPerfil(false)}
>
<Text style={{color:"#fff",fontWeight:"bold"}}>
Volver a la tienda
</Text>
</TouchableOpacity>

</View>

</View>

) : logged ? (

<ScrollView>

<Text style={styles.title}>Hola {nombre} 💖</Text>
<Text style={styles.subtitle}>Divina Mujer Boutique</Text>

<View style={styles.productsContainer}>

{productos.map((item)=>(
<View key={item.id} style={styles.card}>

<Image
source={item.imagen}
style={styles.productImage}
/>

<Text style={styles.productName}>{item.nombre}</Text>

<Text style={styles.price}>${item.precio}</Text>

<TouchableOpacity
onPress={()=>agregarCarrito(item)}
>
<Text style={styles.cart}>🛒</Text>
</TouchableOpacity>

</View>
))}

</View>

<Text style={styles.cartText}>
🛍 Productos en carrito: {carrito.length}
</Text>

<TouchableOpacity
style={styles.button}
onPress={verPerfil}
>
<Text style={styles.buttonText}>👤 Ver perfil</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.button}
onPress={cerrarSesion}
>
<Text style={styles.buttonText}>🚪 Cerrar sesión</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.button}
onPress={obtenerUbicacion}
>
<Text style={styles.buttonText}>📍 Obtener ubicación</Text>
</TouchableOpacity>

{location && (
<View style={{
backgroundColor:"#fff",
padding:15,
borderRadius:10,
marginTop:10,
alignItems:"center",
elevation:3
}}>

<Text style={{fontWeight:"bold",fontSize:16}}>
📍 Ubicación actual
</Text>

<Text>
Latitud: {location.coords.latitude.toFixed(6)}
</Text>

<Text>
Longitud: {location.coords.longitude.toFixed(6)}
</Text>

</View>
)}
<TouchableOpacity
style={styles.button}
onPress={()=>setMostrarCamara(!mostrarCamara)}
>
<Text style={styles.buttonText}>
{mostrarCamara ? "❌ Cerrar cámara" : "📷 Abrir cámara"}
</Text>
</TouchableOpacity>


{mostrarCamara && (
<View style={{height:250,marginTop:20,borderRadius:10,overflow:"hidden"}}>
{device && (
<Camera
style={{flex:1}}
device={device}
isActive={true}
/>
)}
</View>
)}

</ScrollView>

) : (

<>
<Image
source={require("./assets/divamujer.png")}
style={styles.logo}
/>

<Text style={styles.title}>Divina Mujer</Text>

{isRegister&&(
<TextInput
style={styles.input}
placeholder="Nombre"
value={nombre}
onChangeText={setNombre}
/>
)}

<TextInput
style={styles.input}
placeholder="Email"
value={email}
onChangeText={setEmail}
/>

<TextInput
style={styles.input}
placeholder="Contraseña"
secureTextEntry
value={password}
onChangeText={setPassword}
/>

{isRegister&&(
<TextInput
style={styles.input}
placeholder="Confirmar contraseña"
secureTextEntry
value={confirmPassword}
onChangeText={setConfirmPassword}
/>
)}

<TouchableOpacity
style={styles.button}
onPress={isRegister?register:login}
>
<Text style={styles.buttonText}>
{isRegister?"Registrar":"Ingresar"}
</Text>
</TouchableOpacity>

<TouchableOpacity
onPress={()=>setIsRegister(!isRegister)}
>
<Text style={styles.link}>
{isRegister?
"¿Ya tienes cuenta? Inicia sesión":
"¿Eres nueva? Crea una cuenta"}
</Text>
</TouchableOpacity>

</>

)}

</View>

);

}

const styles=StyleSheet.create({

container:{flex:1,backgroundColor:"#fff",padding:20,justifyContent:"center"},

title:{fontSize:26,fontWeight:"bold",textAlign:"center",marginBottom:10},

subtitle:{textAlign:"center",color:"#ff4d88",marginBottom:20},

logo:{width:120,height:120,alignSelf:"center",marginBottom:10},

input:{borderWidth:1,borderColor:"#ddd",padding:10,marginVertical:8,borderRadius:8},

button:{backgroundColor:"#ff2d6f",padding:15,borderRadius:10,marginTop:10},

buttonText:{color:"#fff",textAlign:"center",fontWeight:"bold"},

link:{textAlign:"center",marginTop:15,color:"#ff2d6f"},

productsContainer:{flexDirection:"row",justifyContent:"space-between"},

card:{backgroundColor:"#ffe6ef",padding:10,borderRadius:10,width:"30%",alignItems:"center"},

productImage:{width:70,height:70,resizeMode:"contain"},

productName:{marginTop:5,fontWeight:"bold",textAlign:"center"},

price:{color:"#ff2d6f",fontWeight:"bold"},

cart:{fontSize:22,marginTop:5},

cartText:{textAlign:"center",marginVertical:15,fontWeight:"bold"},

profileContainer:{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"#ffe6ef"},

profileImage:{width:120,height:120,borderRadius:60,marginBottom:-60,zIndex:1},

profileCard:{backgroundColor:"#fff",padding:25,borderRadius:20,width:"90%",alignItems:"center",elevation:5},

profileTitle:{fontSize:22,fontWeight:"bold",marginTop:60},

profileText:{fontSize:16,marginTop:10},

profileButton:{backgroundColor:"#ff2d6f",padding:12,borderRadius:10,marginTop:20,width:"80%",alignItems:"center"}

});
