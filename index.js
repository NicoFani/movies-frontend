fetch('http://localhost:4000/api/movies-genres/movies-with-genres')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
  .then((data) => {
    const moviesContainerElement = document.getElementById('movies-container')
    data.forEach((movie) => {
      let count = 0
      count++
      console.log(count)
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
                <button class="delete-button"><i class="fa-solid fa-trash"></i>Delete</button>
              </div>
            </div>`

      const deleteButtonElement =
        movieCardElement.querySelector('.delete-button')

      deleteButtonElement.addEventListener('click', () => {
        fetch(`http://localhost:4000/api/movies/${movie.id}`, {
          method: 'DELETE'
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok')
            }
            return response.json()
          })
          .then((data) => {
            movieCardElement.remove()
          })
          .catch((error) => {
            console.error(
              'There has been a problem with your fetch operation:',
              error
            )
          })
      })
      document.body.appendChild(movieCardElement)
      moviesContainerElement.appendChild(movieCardElement)
    })
    console.log(data)
  })
  .catch((error) => {
    console.error('There has been a problem with your fetch operation:', error)
  })

const searchInput = document.getElementById('search-input')
const searchButton = document.getElementById('search-button')

searchButton.addEventListener('click', () => {
  const searchValue = searchInput.value.trim()

  fetch(
    `http://localhost:4000/api/movies-genres/movies-with-genres/${encodeURIComponent(
      searchValue
    )}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then((data) => {
      const moviesContainerElement = document.getElementById('movies-container')
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
                <button class="delete-button"><i class="fa-solid fa-trash"></i>Delete</button>
              </div>
            </div>`

        const deleteButtonElement =
          movieCardElement.querySelector('.delete-button')

        deleteButtonElement.addEventListener('click', () => {
          fetch(`http://localhost:4000/api/movies/${movie.id}`, {
            method: 'DELETE'
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok')
              }
              return response.json()
            })
            .then((data) => {
              movieCardElement.remove()
            })
            .catch((error) => {
              console.error(
                'There has been a problem with your fetch operation:',
                error
              )
            })
        })
        document.body.appendChild(movieCardElement)
        moviesContainerElement.appendChild(movieCardElement)
      })
      console.log(data)
    })
    .catch((error) => {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      )
    })
})
