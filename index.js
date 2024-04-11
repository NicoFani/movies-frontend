import parseJwt from './jwt-decode.js'

const moviesContainerElement = document.getElementById('movies-container')
const searchInput = document.getElementById('search-input')
const searchButton = document.getElementById('search-button')
const genresList = document.getElementById('genres-list')
const loginButton = document.getElementById('login-btn')
const userPic = document.getElementById('user-picture')
const myListButton = document.getElementById('my-list-btn')

// Funcion para verificar si el usuario esta logeado, devuelve
function isLoggedIn() {
  const token = localStorage.getItem('token')

  if (!token) {
    return false // No hay token almacenado, el usuario no está autenticado
  }

  try {
    const decodedToken = parseJwt(token) // Intenta decodificar el token JWT
    // Comprueba si el token ha expirado
    const isTokenExpired = decodedToken.exp < Date.now() / 1000
    if (isTokenExpired) {
      // Si el token ha expirado, elimina el token del almacenamiento local
      localStorage.removeItem('token')
      return false // El usuario no está autenticado debido a que el token ha expirado
    }

    // El token es válido y el usuario está autenticado
    return true
  } catch (error) {
    console.log('Error decoding token', error)
    return false // Ocurrió un error al decodificar el token, el usuario no está autenticado
  }
}

fetch('http://localhost:4000/api/movies-genres/')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
  .then((data) => {
    data.forEach((movie) => {
      const movieCardElement = document.createElement('div')
      movieCardElement.classList.add('movie-card')

      const genresList = movie.generos
        ? movie.generos
            .split(',')
            .map((genre) => `<li class="genre-tag">${genre}</li>`)
            .join('')
        : ''

      movieCardElement.innerHTML = `
            <div class="card">
              <img src="${movie.imagen}" alt="${movie.nombre}" />
              <div class="descriptions">
                <span>${movie.nombre}</span>
                <ul>
                  <li>Director: ${movie.director}</li>
                  <li>Estreno: ${movie.anio}</li>
                  <li>Duración: ${movie.duracion} minutes</li>
                </ul>
                <div class="genres-list">
                  ${genresList}
                </div>
                <p>${movie.sinopsis}</p>
                <div class="btn-container">
                <button id="add-btn" ><i class="fa-solid fa-plus"></i></button>
                </div>
              </div>
            </div>`
      document.body.appendChild(movieCardElement)
      moviesContainerElement.appendChild(movieCardElement)
    })
  })
  .catch((error) => {
    console.error('There has been a problem with your fetch operation:', error)
  })

searchButton.addEventListener('click', () => {
  const searchValue = searchInput.value.trim()

  fetch(
    `http://localhost:4000/api/movies-genres/${encodeURIComponent(searchValue)}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then((data) => {
      moviesContainerElement.innerHTML = ''
      data.forEach((movie) => {
        const movieCardElement = document.createElement('div')
        movieCardElement.classList.add('movie-card')

        const genresList = movie.generos
          ? movie.generos
              .split(',')
              .map((genre) => `<li class="genre-tag">${genre}</li>`)
              .join('')
          : ''

        movieCardElement.innerHTML = `
            <div class="card">
              <img src="${movie.imagen}" alt="${movie.nombre}" />
              <div class="descriptions">
                <span>${movie.nombre}</span>
                <ul>
                  <li>Director: ${movie.director}</li>
                  <li>Estreno: ${movie.anio}</li>
                  <li>Duración: ${movie.duracion} minutes</li>
                </ul>
                <div class="genres-list">
                  ${genresList}
                </div>
                <p>${movie.sinopsis}</p>
                <div class="btn-container">
                <button><i class="fa-solid fa-plus"></i></button>
                </div>
              </div>
            </div>`
        document.body.appendChild(movieCardElement)
        moviesContainerElement.appendChild(movieCardElement)
      })
    })
    .catch((error) => {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      )
    })
})

fetch('http://localhost:4000/api/genres')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
  .then((data) => {
    data.forEach((genre) => {
      const genreElement = document.createElement('a')
      genreElement.textContent = genre.nombre
      genreElement.addEventListener('click', () => {
        filterMovieByGenre(genre.id)
      })
      genresList.appendChild(genreElement)
    })
  })
  .catch((error) => {
    console.error('There has been a problem with your fetch operation:', error)
  })

function filterMovieByGenre(genreId) {
  fetch(`http://localhost:4000/api/movies/genres/${genreId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then((data) => {
      moviesContainerElement.innerHTML = ''
      data.forEach((movie) => {
        const movieCardElement = document.createElement('div')
        movieCardElement.classList.add('movie-card')

        const genresList = movie.generos
          ? movie.generos
              .split(',')
              .map((genre) => `<li class="genre-tag">${genre}</li>`)
              .join('')
          : ''

        movieCardElement.innerHTML = `
            <div class="card">
              <img src="${movie.imagen}" alt="${movie.nombre}" />
              <div class="descriptions">
                <span>${movie.nombre}</span>
                <ul>
                  <li>Director: ${movie.director}</li>
                  <li>Estreno: ${movie.anio}</li>
                  <li>Duración: ${movie.duracion} minutes</li>
                </ul>
                <div class="genres-list">
                  ${genresList}
                </div>
                <p>${movie.sinopsis}</p>
                <div class="btn-container">
                <button><i class="fa-solid fa-plus"></i></button>
                </div>
              </div>
            </div>`

        document.body.appendChild(movieCardElement)
        moviesContainerElement.appendChild(movieCardElement)
      })
    })
}
// Funcion para extraer el id del usuario del token

myListButton.addEventListener('click', () => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Debes iniciar sesión para ver tu lista de películas')
    return
  } else {
    const decodedToken = parseJwt(token)
    const userId = decodedToken.id
    fetch(`http://localhost:4000/api/users/${userId}/movies`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        moviesContainerElement.innerHTML = ''
        data.forEach((movie) => {
          const movieCardElement = document.createElement('div')
          movieCardElement.classList.add('movie-card')

          const genresList = movie.generos
            ? movie.generos
                .split(',')
                .map((genre) => `<li class="genre-tag">${genre}</li>`)
                .join('')
            : ''

          movieCardElement.innerHTML = `
            <div class="card">
              <img src="${movie.imagen}" alt="${movie.nombre}" />
              <div class="descriptions">
                <span>${movie.nombre}</span>
                <ul>
                  <li>Director: ${movie.director}</li>
                  <li>Estreno: ${movie.anio}</li>
                  <li>Duración: ${movie.duracion} minutes</li>
                </ul>
                <div class="genres-list">
                  ${genresList}
                </div>
                <p>${movie.sinopsis}</p>
                <div class="btn-container">
                <button><i class="fa-solid fa-plus"></i></button>
                </div>
              </div>
            </div>`

          document.body.appendChild(movieCardElement)
          moviesContainerElement.appendChild(movieCardElement)
        })
      })
      .catch((error) => {
        console.error(
          'There has been a problem with your fetch operation:',
          error
        )
      })
  }
})

loginButton.addEventListener('click', () => {
  console.log('Login button clicked')
  window.location.href = './login/login.html'
})

const tokenObtenido = localStorage.getItem('token')
console.log('Token obtenido:', tokenObtenido)

console.log('Decoded token', parseJwt(tokenObtenido))

document.addEventListener('DOMContentLoaded', function () {
  if (isLoggedIn()) {
    loginButton.style.display = 'none'
    userPic.style.display = 'block'
  } else {
    loginButton.style.display = 'block'
    userPic.style.display = 'none'
  }
})

userPic.addEventListener('click', () => {
  localStorage.removeItem('token')
  userPic.style.display = 'none'
  loginButton.style.display = 'block'
  window.location.href = 'index.html'
})
