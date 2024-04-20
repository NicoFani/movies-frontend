// const url = 'https://movies-server-2kuw.onrender.com'
const url = 'http://localhost:4000'

document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.getElementById('signup-form')

  signupForm.addEventListener('submit', function (event) {
    event.preventDefault() // Evitar que el formulario se envíe automáticamente

    const email = document.getElementById('email').value
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    // Validación simple para asegurarse de que los campos no estén vacíos
    if (
      username.trim() === '' ||
      password.trim() === '' ||
      email.trim() === ''
    ) {
      alert('Por favor, rellena todos los campos.')
      return
    }

    // Crear un objeto con los datos del usuario
    const userData = {
      email: email,
      nombre_usuario: username,
      contraseña: password
    }

    // Enviar datos al servidor (aquí debes hacer la solicitud HTTP POST al backend)
    fetch(`${url}/api/users/register`, {
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
        console.log('Usuario registrado correctamente:', data)
        window.location.href = '../login/login.html'
      })
      .catch((error) => {
        console.error('Hubo un problema con la solicitud:', error)
        alert(
          'Hubo un problema al registrar el usuario. Por favor, inténtalo de nuevo más tarde.'
        )
      })
  })
})
