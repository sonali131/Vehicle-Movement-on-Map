const socket=io();
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
      const {latitude,longitude} = position.coords;
      socket.emit("send-location",{latitude,longitude});
      socket.on("disconnect",function(){
        io.emit("user-disconnect",socket.id);
      })
    },(error)=>{
        console.error(error);

    },
    {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0
    }
);
}

const map=L.map("map").setView([0,0],16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"OpenStreetMap"
}).addTo(map);

const markers={};
socket.on("receive-location",(data)=>{
    const {id,latitude,longitude}=data;
    map.setView([latitude,longitude],16);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);

    }
});

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})



// Define the initial vehicle coordinates
let vehicleCoordinates = [51.505, -0.09];

// Add a vehicle marker (car icon)
const vehicleIcon = L.icon({
    iconUrl: '/images/download.jpg', 
    iconSize: [50, 50], // Size of the icon
    iconAnchor: [25, 25], // Anchor the icon (half the size to center it)
});


const vehicleMarker = L.marker(vehicleCoordinates, { icon: vehicleIcon }).addTo(map);


function moveVehicle() {
   
    vehicleCoordinates[0] += 0.0001; // Move north
    vehicleCoordinates[1] -= 0.0001; // Move east
    
    
    vehicleMarker.setLatLng(vehicleCoordinates);

   
    map.panTo(vehicleCoordinates);
}

// Simulate the vehicle movement every 500 milliseconds
setInterval(moveVehicle, 700);


//-----------down

