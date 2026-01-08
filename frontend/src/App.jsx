import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import './App.css';

function App() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/zabbix/devices');
      if (!response.ok) throw new Error('Erro ao buscar dispositivos');
      const data = await response.json();
      setDevices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mapa de Dispositivos Zabbix - Brasil</h1>
        <p>Monitoramento geográfico de dispositivos</p>
      </header>
      
      <main>
        {loading && <div className="loading">Carregando dispositivos...</div>}
        {error && <div className="error">Erro: {error}</div>}
        
        <div className="map-container">
          <MapComponent devices={devices} />
        </div>
        
        <div className="devices-summary">
          <h2>Dispositivos Monitorados: {devices.length}</h2>
          <div className="device-list">
            {devices.map(device => (
              <div key={device.id} className="device-item">
                <strong>{device.name}</strong>
                <span>{device.location}</span>
                <small>Lat: {device.latitude}, Lon: {device.longitude}</small>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
