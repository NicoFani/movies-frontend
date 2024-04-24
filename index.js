import parseJwt from './services/jwt-decode.js'
import isLoggedIn from './services/isLogged.js'
import isFavourite from './services/isFavourite.js'

const url = 'https://movies-server-2kuw.onrender.com'
// const url = 'http://localhost:4000'
const moviesContainerElement = document.getElementById('movies-container')
const searchInput = document.getElementById('search-input')
const searchButton = document.getElementById('search-button')
const genresList = document.getElementById('genres-list')
const loginButton = document.getElementById('login-btn')
const userPic = document.getElementById('user-picture')
const myListButton = document.getElementById('my-list-btn')
const moviePoster = document.getElementById('main-movie-container')
const overlay = document.getElementById('overlay')
const closeButton = document.getElementById('close-button')
const modalOverlay = document.getElementById('modal-overlay')
const movieModal = document.getElementById('movie-modal')
const moviesGrid = document.getElementById('movies-grid')

fetch(`${url}/api/movies-genres/`)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
  .then(async (data) => {
    data.forEach(async (movie) => {
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
                <div class="btn-container">
                <button title="Add to favorites" id="add-btn" class="add-btn"><i class="fa-regular fa-heart"></i></button>
                <button title="Delete from favorites" id="delete-btn" class="delete-btn"><i class="fa-solid fa-heart"></i></button>
                <button title="View more" id="view-btn" class="view-btn"><i class="fa-solid fa-eye"></i></button>
                </div>
              </div>
            </div>`
      moviesGrid.appendChild(movieCardElement)
      // ------- Event Listener for the view more button ----------
      const viewButton = movieCardElement.querySelector('.view-btn')
      if (viewButton) {
        viewButton.addEventListener('click', () => {
          modalOverlay.classList.add('active')
          movieModal.classList.add('active')
          document.getElementById('modal-title').textContent = movie.nombre
          document.getElementById('modal-description').textContent =
            movie.sinopsis
          document.getElementById('modal-image').src = movie.poster
          document.getElementById('duration-p').textContent =
            `Duration: ${movie.duracion} minutes`
          document.getElementById('genres-ul').innerHTML = genresList
          document.getElementById('director-p').textContent =
            `Director: ${movie.director}`
          document.getElementById('year-p').textContent = `Year: ${movie.anio}`
        })
      }
      // ------- Event Listener for the add button ----------
      const addButton = movieCardElement.querySelector('.add-btn')
      if (addButton) {
        try {
          const token = localStorage.getItem('token')
          if (token) {
            const decodedToken = parseJwt(token)
            const userId = decodedToken.id
            const movieId = movie.id

            const isFav = await isFavourite(userId, movieId)

            if (isFav) {
              addButton.style.display = 'none'
            } else {
              addButton.style.display = 'block'
            }
          } else {
            addButton.style.display = 'none'
          }

          addButton.addEventListener('click', () => {
            addButton.style.display = 'none'
            deleteButton.style.display = 'block'
            const decodedToken = parseJwt(token)
            const userId = decodedToken.id
            const movieId = movie.id

            const userMovieData = {
              id_usuario: userId,
              id_pelicula: movieId
            }

            fetch(`${url}/api/users-movies`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(userMovieData)
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error('Network response was not ok')
                }
                return response.json()
              })
              .then((data) => {
                console.log('Movie added to list:', data)
              })
              .catch((error) => {
                console.error(
                  'There has been a problem with your fetch operation:',
                  error
                )
              })
          })
        } catch (error) {
          console.error('Error fetching or parsing data', error)
        }
      }

      // -----------------------------------------------------------------
      const deleteButton = movieCardElement.querySelector('.delete-btn')
      if (deleteButton) {
        try {
          const token = localStorage.getItem('token')
          if (token) {
            const decodedToken = parseJwt(token)
            const userId = decodedToken.id
            const movieId = movie.id

            const isFav = await isFavourite(userId, movieId)

            if (isFav) {
              deleteButton.style.display = 'block'
            } else {
              deleteButton.style.display = 'none'
            }
          } else {
            deleteButton.style.display = 'none'
          }

          deleteButton.addEventListener('click', () => {
            deleteButton.style.display = 'none'
            addButton.style.display = 'block'
            const decodedToken = parseJwt(token)
            const userId = decodedToken.id
            const movieId = movie.id

            fetch(`${url}/api/users-movies/${userId}/${movieId}`, {
              method: 'DELETE',
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
                console.log('Movie deleted from list:', data)
              })
              .catch((error) => {
                console.error(
                  'There has been a problem with your fetch operation:',
                  error
                )
              })
          })
        } catch (error) {
          console.error('Error fetching or parsing data', error)
        }
      }
    })
  })
  .catch((error) => {
    console.error('There has been a problem with your fetch operation:', error)
  })

searchButton.addEventListener('click', () => {
  const searchValue = searchInput.value.trim()

  fetch(`${url}/api/movies-genres/${encodeURIComponent(searchValue)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(async (data) => {
      moviesGrid.innerHTML = ''
      data.forEach(async (movie) => {
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
                <div class="btn-container">
                <button title="Add to favorites" id="add-btn" class="add-btn"><i class="fa-regular fa-heart"></i></button>
                <button title="Delete from favorites" id="delete-btn" class="delete-btn"><i class="fa-solid fa-heart"></i></button>
                </div>
              </div>
            </div>`
        moviesGrid.appendChild(movieCardElement)
        // ------- Event Listener for the add button ----------
        const addButton = movieCardElement.querySelector('.add-btn')
        if (addButton) {
          try {
            const token = localStorage.getItem('token')
            if (token) {
              const decodedToken = parseJwt(token)
              const userId = decodedToken.id
              const movieId = movie.id

              const isFav = await isFavourite(userId, movieId)

              if (isFav) {
                addButton.style.display = 'none'
              } else {
                addButton.style.display = 'block'
              }
            } else {
              addButton.style.display = 'none'
            }

            addButton.addEventListener('click', () => {
              addButton.style.display = 'none'
              deleteButton.style.display = 'block'
              const decodedToken = parseJwt(token)
              const userId = decodedToken.id
              const movieId = movie.id

              const userMovieData = {
                id_usuario: userId,
                id_pelicula: movieId
              }

              fetch(`${url}/api/users-movies`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(userMovieData)
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok')
                  }
                  return response.json()
                })
                .then((data) => {
                  console.log('Movie added to list:', data)
                })
                .catch((error) => {
                  console.error(
                    'There has been a problem with your fetch operation:',
                    error
                  )
                })
            })
          } catch (error) {
            console.error('Error fetching or parsing data', error)
          }
        }

        // -----------------------------------------------------------------
        const deleteButton = movieCardElement.querySelector('.delete-btn')
        if (deleteButton) {
          try {
            const token = localStorage.getItem('token')
            if (token) {
              const decodedToken = parseJwt(token)
              const userId = decodedToken.id
              const movieId = movie.id

              const isFav = await isFavourite(userId, movieId)

              if (isFav) {
                deleteButton.style.display = 'block'
              } else {
                deleteButton.style.display = 'none'
              }
            } else {
              deleteButton.style.display = 'none'
            }

            deleteButton.addEventListener('click', () => {
              deleteButton.style.display = 'none'
              addButton.style.display = 'block'
              const decodedToken = parseJwt(token)
              const userId = decodedToken.id
              const movieId = movie.id

              fetch(`${url}/api/users-movies/${userId}/${movieId}`, {
                method: 'DELETE',
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
                  console.log('Movie deleted from list:', data)
                })
                .catch((error) => {
                  console.error(
                    'There has been a problem with your fetch operation:',
                    error
                  )
                })
            })
          } catch (error) {
            console.error('Error fetching or parsing data', error)
          }
        }
      })
    })
    .catch((error) => {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      )
    })
})

fetch(`${url}/api/genres`)
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
  fetch(`${url}/api/movies/genres/${genreId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(async (data) => {
      moviesGrid.innerHTML = ''
      data.forEach(async (movie) => {
        const movieCardElement = document.createElement('div')
        movieCardElement.classList.add('movie-card')

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
                  ${movie.generos.map((genre) => `<li class="genre-tag">${genre}</li>`).join('')}
                </div>
                <div class="btn-container">
                <button title="Add to favorites" id="add-btn" class="add-btn"><i class="fa-regular fa-heart"></i></button>
                <button title="Delete from favorites" id="delete-btn" class="delete-btn"><i class="fa-solid fa-heart"></i></button>
                </div>
              </div>
            </div>`

        moviesGrid.appendChild(movieCardElement)

        // ------- Event Listener for the add button ----------
        const addButton = movieCardElement.querySelector('.add-btn')
        if (addButton) {
          try {
            const token = localStorage.getItem('token')
            if (token) {
              const decodedToken = parseJwt(token)
              const userId = decodedToken.id
              const movieId = movie.id

              const isFav = await isFavourite(userId, movieId)

              if (isFav) {
                addButton.style.display = 'none'
              } else {
                addButton.style.display = 'block'
              }
            } else {
              addButton.style.display = 'none'
            }

            addButton.addEventListener('click', () => {
              addButton.style.display = 'none'
              deleteButton.style.display = 'block'
              const decodedToken = parseJwt(token)
              const userId = decodedToken.id
              const movieId = movie.id

              const userMovieData = {
                id_usuario: userId,
                id_pelicula: movieId
              }

              fetch(`${url}/api/users-movies`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(userMovieData)
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok')
                  }
                  return response.json()
                })
                .then((data) => {
                  console.log('Movie added to list:', data)
                })
                .catch((error) => {
                  console.error(
                    'There has been a problem with your fetch operation:',
                    error
                  )
                })
            })
          } catch (error) {
            console.error('Error fetching or parsing data', error)
          }
        }

        // -----------------------------------------------------------------
        const deleteButton = movieCardElement.querySelector('.delete-btn')
        if (deleteButton) {
          try {
            const token = localStorage.getItem('token')
            if (token) {
              const decodedToken = parseJwt(token)
              const userId = decodedToken.id
              const movieId = movie.id

              const isFav = await isFavourite(userId, movieId)

              if (isFav) {
                deleteButton.style.display = 'block'
              } else {
                deleteButton.style.display = 'none'
              }
            } else {
              deleteButton.style.display = 'none'
            }

            deleteButton.addEventListener('click', () => {
              deleteButton.style.display = 'none'
              addButton.style.display = 'block'
              const decodedToken = parseJwt(token)
              const userId = decodedToken.id
              const movieId = movie.id

              fetch(`${url}/api/users-movies/${userId}/${movieId}`, {
                method: 'DELETE',
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
                  console.log('Movie deleted from list:', data)
                })
                .catch((error) => {
                  console.error(
                    'There has been a problem with your fetch operation:',
                    error
                  )
                })
            })
          } catch (error) {
            console.error('Error fetching or parsing data', error)
          }
        }
      })
    })
}

myListButton.addEventListener('click', () => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Debes iniciar sesión para ver tu lista de películas')
    return
  } else {
    const decodedToken = parseJwt(token)
    const userId = decodedToken.id
    fetch(`${url}/api/users/${userId}/movies`, {
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
      .then(async (data) => {
        moviePoster.style.display = 'none'
        overlay.style.display = 'none'
        moviesContainerElement.style.height = 'auto'
        moviesContainerElement.style.alignItems = 'center'
        moviesContainerElement.style.justifyContent = 'center'
        moviesContainerElement.style.marginTop = '100px'
        moviesContainerElement.innerHTML = `<h2 class="my-list-title">My List</h2>`
        if (data.length === 0) {
          console.log('No movies in list')
          moviesContainerElement.innerHTML = `<h2 class="my-list-title">My List</h2>
          <h3 class="no-movies">You don't have any movies in your list</h3>`
        }
        data.forEach(async (movie) => {
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
                <div class="btn-container">
                <button title="Delete from favorites" id="delete-btn" class="delete-btn"><i class="fa-solid fa-heart"></i></button>
                </div>
              </div>
            </div>`

          document.body.appendChild(movieCardElement)
          moviesContainerElement.appendChild(movieCardElement)

          const deleteButton = movieCardElement.querySelector('.delete-btn')
          if (deleteButton) {
            try {
              const token = localStorage.getItem('token')
              if (token) {
                const decodedToken = parseJwt(token)
                const userId = decodedToken.id
                const movieId = movie.id

                const isFav = await isFavourite(userId, movieId)

                if (isFav) {
                  deleteButton.style.display = 'block'
                } else {
                  deleteButton.style.display = 'none'
                }
              } else {
                deleteButton.style.display = 'none'
              }

              deleteButton.addEventListener('click', () => {
                movieCardElement.style.display = 'none'
                deleteButton.style.display = 'none'
                const decodedToken = parseJwt(token)
                const userId = decodedToken.id
                const movieId = movie.id

                fetch(`${url}/api/users-movies/${userId}/${movieId}`, {
                  method: 'DELETE',
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
                    console.log('Movie deleted from list:', data)
                  })
                  .catch((error) => {
                    console.error(
                      'There has been a problem with your fetch operation:',
                      error
                    )
                  })
              })
            } catch (error) {
              console.error('Error fetching or parsing data', error)
            }
          }
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

// Event listener for the login button
loginButton.addEventListener('click', () => {
  window.location.href = './login/login.html'
})

// const tokenObtenido = localStorage.getItem('token')
// console.log('Token obtenido:', tokenObtenido)

// console.log('Decoded token', parseJwt(tokenObtenido))

// Event listener to show user picture when logged in
document.addEventListener('DOMContentLoaded', function () {
  if (isLoggedIn()) {
    loginButton.style.display = 'none'
    userPic.style.display = 'block'
  } else {
    loginButton.style.display = 'block'
    userPic.style.display = 'none'
  }
})

// Event listener to click de user picture to log out
userPic.addEventListener('click', () => {
  localStorage.removeItem('token')
  userPic.style.display = 'none'
  loginButton.style.display = 'block'
  window.location.href = 'index.html'
})

// Functions to navigate across the app

loginButton.addEventListener('click', () => {
  window.location.href = 'login/login.html'
})

// Change header background color when scrolling

window.addEventListener('scroll', () => {
  const header = document.querySelector('header')
  header.classList.toggle('sticky', window.scrollY > 0)
})

closeButton.addEventListener('click', () => {
  modalOverlay.classList.remove('active')
  movieModal.classList.remove('active')
})
