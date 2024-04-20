import parseJwt from './jwt-decode.js'

// Funcion para verificar si el usuario esta logeado
function isLoggedIn() {
  const token = localStorage.getItem('token')

  if (!token) {
    return false
  }

  try {
    const decodedToken = parseJwt(token)
    const isTokenExpired = decodedToken.exp < Date.now() / 1000
    if (isTokenExpired) {
      console.log('Token expired')
      localStorage.removeItem('token')
      return false
    }
    return true
  } catch (error) {
    console.log('Error decoding token', error)
    return false
  }
}

export default isLoggedIn
