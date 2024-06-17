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
            // Mostrar los datos en el contenedor
            data.forEach(plazo => {
                cargar_plazos(plazo);
            });

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
});