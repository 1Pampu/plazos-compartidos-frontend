function login() {
    // Obtener los datos del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validar que los campos no estén vacíos
    if (email.trim() === '' || password.trim() === '') {
      toast_message('Por favor ingrese su email y contraseña.', 'Error');
      return false;
    }

    // Validar que el email tenga un formato válido
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast_message('Por favor ingrese un email válido.', 'Error');
      return false;
    }

    // Enviar los datos al servidor
    fetch(API_URL + 'api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
          return response.json().then(errorJson => {
            toast_message(errorJson.detail, 'Error');
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorJson.detail}`);
          });
        }
        return response.json();
    })
    .then(data => {
        // Guardar el token y redirigir al index
        localStorage.setItem('token', data.tokens.access);
        window.location.href = 'index.html';
    })
    .catch(error => {
        toast_message('¡Hubo un problema con la solicitud!', 'Error');
        console.error('¡Hubo un problema con la solicitud!', error);
    });
}