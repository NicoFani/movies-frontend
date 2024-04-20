// const url = 'https://movies-server-2kuw.onrender.com'
const url = 'http://localhost:4000'

// Funcion utilizada para saber si una pelicula es favorita de un usuario

async function isFavourite(id_usuario, id_pelicula) {
  try {
    const response = await fetch(
      `${url}/api/users-movies/${id_usuario}/${id_pelicula}`
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    if (data.found) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('Error fetching or parsing data', error)
    return false
  }
}

export default isFavourite
