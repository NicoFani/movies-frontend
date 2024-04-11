document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form')

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault() // Evitar que el formulario se envíe automáticamente

    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    // Validación simple para asegurarse de que los campos no estén vacíos
    if (username.trim() === '' || password.trim() === '') {
      alert('Por favor, rellena todos los campos.')
      return
    }

    // Crear un objeto con los datos del usuario
    const userData = {
      nombre_usuario: username,
      contraseña: password
    }

    // Enviar datos al servidor (aquí debes hacer la solicitud HTTP POST al backend)
    fetch('http://localhost:4000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        const token = data.token
        localStorage.setItem('token', token)
        console.log('Usuario logeado correctamente:', data)
        window.location.href = '../index.html'
      })
      .catch((error) => {
        console.error('Hubo un problema con la solicitud:', error)
        alert(
          'Hubo un problema al logear el usuario. Por favor, inténtalo de nuevo más tarde.'
        )
      })
  })
})

// function isLoggedIn() {
//   const token = localStorage.getItem('token')

//   if (!token) {
//     return false
//   }

//   try {
//     const decodedToken = jwt_decode(token)
//     console.log('Decoded token:', decodedToken)
//     return true
//   } catch (error) {
//     console.log('Error decoding token', error)
//     return false
//   }
// }

// document.addEventListener('DOMContentLoaded', function () {
//   const messageElement = document.getElementById('logged-message')

//   if (isLoggedIn()) {
//     messageElement.style.display = 'block'
//   } else {
//     messageElement.style.display = 'none'
//   }
// })
