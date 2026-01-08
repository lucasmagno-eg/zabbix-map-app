import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Posição inicial: Centro do Brasil
const centerPosition = [-15.7801, -47.9292];

const MapComponent = ({ devices }) => {
  // Criar ícone personalizado
  const createCustomIcon = (color = 'blue') => {
    return L.divIcon({
      html: `<div style="
        background-color: ${color};
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.5);
      "></div>`,
      className: 'custom-marker',
      iconSize: [16, 16],
    });
  };

  return (
    <MapContainer
      center={centerPosition}
      zoom={4}
      style={{ height: '500px', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {devices.map((device) => (
        <Marker
          key={device.id}
          position={[device.latitude, device.longitude]}
          icon={createCustomIcon('#3388ff')}
        >
          <Popup>
            <div style={{ padding: '5px' }}>
              <strong>{device.name}</strong><br />
              <small>{device.location}</small><br />
              <small>ID: {device.id}</small>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
