// Middleware para validação de entrada
function validateInput(req, res, next) {
  // Validar parâmetros de latitude/longitude se presentes
  if (req.query.lat || req.query.lon) {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    
    if (isNaN(lat) || isNaN(lon) || 
        lat < -90 || lat > 90 || 
        lon < -180 || lon > 180) {
      return res.status(400).json({ 
        error: 'Coordenadas inválidas' 
      });
    }
  }
  next();
}

// Middleware para logging de requisições
function requestLogger(req, res, next) {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);
  next();
}

module.exports = {
  validateInput,
  requestLogger
};
