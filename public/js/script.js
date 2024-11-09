const socket=io();
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude}=position.coords;
        console.log(latitude,longitude);
        socket.emit("send-location",{latitude,longitude});
    },
    (err)=>{
        console.log(err);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0  // no caching
    }
);
}

const map=L.map("map").setView([0,0],10);
// coordinates initialzed, scale of map

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "Track NOW!"
}).addTo(map);
// is map pe ye tile layer add kardo

const markers={};
socket.on("rec-location",(data)=>{
    const{id, latitude, longitude}=data;
    map.setView([latitude,longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
