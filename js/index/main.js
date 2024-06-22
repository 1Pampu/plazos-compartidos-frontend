document.addEventListener('DOMContentLoaded', (event) => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
    }

    // Funcion para obtener los datos de la API
    const fetchData = async () => {
        try {
            const response = await fetch(API_URL + 'api/plazos', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token no válido, redirigir al login
                    throw new Error('Unauthorized');
                } else {
                    throw new Error('Error fetching data');
                }
            }

            const data = await response.json();
            // Comprobar si hay mas de 0 plazos
            if (data.length === 0) {
                document.getElementById('data-loading').innerHTML = '<h2 class="text-center pb-2">No hay plazos</h2>';
            } else {
                document.getElementById('data-loading').innerHTML = '';
                data.forEach(plazo => {
                    cargar_plazos(plazo);
                });
            }

        } catch (error) {
            console.error('Fetch data error:', error);
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    };

    // Llamar a la función fetchData si hay token
    if (token) {
        fetchData();
    }

    // Enviar formulario de creacion de plazo
    document.getElementById('crearPlazoForm').addEventListener('submit', function(event) {
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
        fetch(API_URL + 'api/plazos', {
            method: 'POST',
            headers: {
                'Authorization':  `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            cargar_plazos(data)
            toast_message('Plazo creado correctamente', 'Notificación');
        })
        .catch((error) => {
            console.log(error)
            toast_message('Error al crear el plazo', 'Error');
        });
    })
});