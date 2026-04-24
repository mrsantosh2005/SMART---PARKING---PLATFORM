import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Bike rental locations
const bikeLocations = [
  { id: 1, lat: 16.7050, lng: 74.2433, name: "MotoRent Kolhapur", bikes: 5, price: 100 },
  { id: 2, lat: 16.7100, lng: 74.2500, name: "MotoRent Market", bikes: 3, price: 120 },
  { id: 3, lat: 16.6980, lng: 74.2380, name: "MotoRent Station", bikes: 7, price: 90 },
];

const bikeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const BikeRentalMap = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden">
      <MapContainer
        center={[16.7050, 74.2433]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {bikeLocations.map((bike) => (
          <Marker key={bike.id} position={[bike.lat, bike.lng]} icon={bikeIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">🏍️ {bike.name}</h3>
                <p>Available Bikes: {bike.bikes}</p>
                <p>Price: ₹{bike.price}/hour</p>
                <button className="mt-2 bg-green-600 text-white px-3 py-1 rounded">
                  Rent Now
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BikeRentalMap;