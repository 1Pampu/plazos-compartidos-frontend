function cargar_plazos(plazo){
    var contenedor = document.getElementById('data-container');
    var plazo_div = document.createElement('tr');
    var loading = document.getElementById('data-loading');
    loading.innerHTML = '';

    // Asignar valores predeterminados si son undefined o null
    var num_entidades = plazo.num_entidades || 0;
    var monto = plazo.monto != null ? plazo.monto : 0;

    plazo_div.innerHTML = `
        <td class="pt-0 pb-0 ps-0 pe-0"><a href="plazo.html?plazo=${plazo.id}" class="text-decoration-none d-block text-white pt-3 pb-3 ps-3 pe-2">${plazo.titulo}</a></td>
        <td class="pt-0 pb-0 ps-0 pe-0"><a href="plazo.html?plazo=${plazo.id}" class="text-decoration-none d-block text-white pt-3 pb-3 ps-3 pe-2">${num_entidades}</a></td>
        <td class="pt-0 pb-0 ps-0 pe-0"><a href="plazo.html?plazo=${plazo.id}" class="text-decoration-none d-block text-white pt-3 pb-3 ps-3 pe-2">${plazo.interes}%</a></td>
        <td class="pt-0 pb-0 ps-0 pe-0"><a href="plazo.html?plazo=${plazo.id}" class="text-decoration-none d-block text-white pt-3 pb-3 ps-3 pe-2">$${monto.toFixed(2)}</a></td>
        <td class="text-center align-middle">
            <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#eliminarPlazoModal" onclick="updateEliminarPlazo('${plazo.titulo}', ${plazo.id})">Borrar</button>
        </td>
        `;
    contenedor.appendChild(plazo_div);
}

function updateEliminarPlazo(plazo_title, id){
    // Actualizar el boton de eliminar plazo
    button_div = document.getElementById('eliminarPlazoBoton');
    button_div.innerHTML = `<button type="button" class="btn btn-danger" onclick="eliminarPlazo(${id})">Eliminar</button>`;

    // Actualizar el titulo del plazo
    titlo = document.getElementById('titulo-plazo-eliminar');
    titlo.innerHTML = plazo_title;
}

function eliminarPlazo(id){
    // Obtener el token de autenticación
    const token = localStorage.getItem('token');

    // Enviar la solicitud para eliminar el plazo
    fetch(API_URL + 'api/plazos/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                // Token no válido, redirigir al login
                throw new Error('Unauthorized');
            } else {
                throw new Error('Error eliminando plazo');
            }
        }
        toast_message('Plazo eliminado correctamente.', 'Notificación');
        window.location.reload();
    })
    .catch(error => {
        console.error('Error eliminando plazo:', error);
        toast_message('Error eliminando plazo', 'Error');
    });
}