// Funcion para decodificar el token JWT
function parseJwt(token) {
  // Dividir el token JWT en sus partes (encabezado, carga útil, firma)
  if (token) {
    var base64Url = token.split('.')[1] // Obtenemos la parte de la carga útil (payload)

    // Decodificar la carga útil en base64
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/') // Reemplazar caracteres especiales
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2) // Convertir a formato URI
        })
        .join('')
    )

    // Parsear el JSON decodificado
    return JSON.parse(jsonPayload)
  }
}

export default parseJwt
