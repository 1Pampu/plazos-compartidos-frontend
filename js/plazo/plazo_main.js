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
            window.location.href = 'index.html';
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
    obtener_y_cargar_entidades(plazo_id);

    // Envio formulario de creacion de entidad
    document.getElementById('form-entidad').addEventListener('submit', function(event) {
        // Prevenir el envio normal del formulario
        event.preventDefault();

        // Obtener los datos del formulario
        const formData = new FormData(this);

        // Convertir FormData a un objeto JSON
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Enviar los datos a la API con cabeceras personalizadas
        fetch(API_URL + 'api/plazos/' + plazo_id + '/entidades', {
            method: 'POST',
            headers: {
                'Authorization':  `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            toast_message('Entidad creada correctamente', 'Notificación');
            agregar_entidad(data);
        })
        .catch((error) => {
            toast_message('Error al crear la entidad', 'Error');
        });
    });

    // Envio formulario de deposito / retiro
    document.getElementById('form-retiro-deposito').addEventListener('submit', function(event) {
        // Prevenir el envio normal del formulario
        event.preventDefault();

        // Obtener los datos del formulario
        const formData = new FormData(this);

        // Convertir FormData a un objeto JSON
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Obtener el id de la entidad
        const entidad_id = document.getElementById('id-retirar-depositar').innerHTML;

        // Enviar la solicitud para retirar o depositar
        fetch(API_URL + 'api/plazos/' + plazo_id + '/operaciones/' + entidad_id, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al realizar la operación');
            }
            return response.json();
        })
        .then(data => {
            toast_message('Operación realizada correctamente.', 'Notificación');
            location.reload();
        })
        .catch(error => {
            toast_message('Error al realizar la operación', 'Error');
            console.error('¡Hubo un problema con la solicitud!', error);
        });
    });
});