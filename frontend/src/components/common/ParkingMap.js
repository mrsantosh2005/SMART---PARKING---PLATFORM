import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom bike icon
const bikeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom car icon
const carIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to center map on user location
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14);
    }
  }, [center, map]);
  return null;
}

const ParkingMap = ({ parkings, onMarkerClick, center }) => {
  const [userLocation, setUserLocation] = useState(null);

  // Default center (India)
  const defaultCenter = { lat: 20.5937, lng: 78.9629 };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={center || defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        {/* OpenStreetMap Tile Layer - Free! */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User's Current Location Marker */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={new L.Icon.Default()}
          >
            <Popup>
              <div className="text-center">
                <strong>📍 Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Parking Locations Markers */}
        {parkings?.map((parking) => (
          <Marker
            key={parking._id}
            position={[
              parking.location?.coordinates?.[1] || parking.latitude || 0,
              parking.location?.coordinates?.[0] || parking.longitude || 0
            ]}
            icon={parking.type === 'bike' ? bikeIcon : carIcon}
            eventHandlers={{
              click: () => onMarkerClick?.(parking)
            }}
          >
            <Popup>
              <div className="min-w-[200px] p-2">
                <h3 className="font-bold text-lg mb-2">{parking.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{parking.address}</p>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">🚗 Cars: {parking.availableCarSlots}/{parking.totalCarSlots}</span>
                  <span className="text-sm">🏍️ Bikes: {parking.availableBikeSlots}/{parking.totalBikeSlots}</span>
                </div>
                <p className="text-blue-600 font-semibold">💰 ₹{parking.pricePerHour}/hour</p>
                <button
                  onClick={() => onMarkerClick?.(parking)}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Book Now →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        <ChangeMapView center={center || userLocation} />
      </MapContainer>
    </div>
  );
};

export default ParkingMap;