document.addEventListener('DOMContentLoaded', (event) => {
    // Obtener el token de autenticación
    const token = localStorage.getItem('token');

    // Obtener los parametros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const plazo_id = urlParams.get('plazo')

    // Si no se encuentra el parametro o no es un numero
    if (!plazo_id || isNaN(plazo_id)) {
        window.location.href = 'index.html';
    }

    // Obtener la informacion del plazo
    fetch(API_URL + 'api/plazos/' + plazo_id,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            alert('Error al obtener los datos del plazo');
            windows.location.href = 'index.html';
        }
        return response.json();
    })
    .then(data => {
        // Cargar los datos en la pagina
        plazo_info(data);
    })
    .catch(error => {
        console.error('¡Hubo un problema con la solicitud!', error);
    });

    // Obtener las entidades del plazo
    fetch(API_URL + `api/plazos/${plazo_id}/entidades` ,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            alert('Error al obtener los datos del plazo');
            windows.location.href = 'index.html';
        }
        return response.json();
    })
    .then(data => {
        // Cargar los datos en la pagina
        plazo_entidades(data);
    })
    .catch(error => {
        console.error('¡Hubo un problema con la solicitud!', error);
    });

});