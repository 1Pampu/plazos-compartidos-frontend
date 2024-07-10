function calcular_intereses(plazo_id){
    // Obtener el token de autenticación
    const token = localStorage.getItem('token');

    // Obtener la informacion del plazo
    fetch(API_URL + 'api/plazos/' + plazo_id + '/calcular_intereses',{
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        // Recargar la pagina
        location.reload();
    })
    .catch(error => {
        toast_message('Error al calcular los intereses', 'Error');
        console.error('¡Hubo un problema con la solicitud!', error);
    });
}

function plazo_info(plazo){
    // Remplazar los datos en la card
    var plazo_div = document.getElementById('plazo-info')
    plazo_div.innerHTML = `
        <div class="card" style="min-width:300px;">
            <div class="card-body">
                <h3 class="card-title">${plazo.titulo}</h3>
                <p class="card-text mb-1"><strong>Total:</strong> $${plazo.monto.toFixed(2)}</p>
                <p class="card-text mb-1"><strong>Interés:</strong> ${plazo.interes}%</p>
                <p class="card-text"><strong>Entidades: </strong id="entidades-count">${plazo.num_entidades}</p>
            </div>
        </div>
    `;
}

function plazo_entidades(entidades){
    // Obtener el contenedor de entidades
    var container = document.getElementById('entidades-container');

    // Si hay entidades, eliminar el spinner
    if (entidades.length > 0){
        container.innerHTML = '';
    }

    // Iterar sobre las entidades y almacenar su monto
    let lista_montos = [];
    let lista_nombres = [];
    entidades.forEach(entidad => {
        lista_montos.push(entidad.monto.toFixed(2));
        lista_nombres.push(entidad.nombre);
        agregar_entidad(entidad);
    });

    // Graficamos los datos
    grafico_torta(lista_montos, lista_nombres);
}

function grafico_torta(montos, nombres){
    // Definimos los datos del grafico
    const data = [{
        'values': montos,
        'labels': nombres,
        'type': 'pie',
        'hovertemplate': `%{label}<br>Monto: $%{value}<br>Total: %{percent}<extra></extra>`,
    }];

    // Definimos la estetica del grafico
    const layout = {
        'height': 400,
        'width': 500
    };

    // Generamos el grafico
    Plotly.newPlot('pie-chart', data, layout, {'displayModeBar': false});
}

function agregar_entidad(entidad){
    // Obtener el contenedor de entidades
    var container = document.getElementById('entidades-container');

    // Eliminar el spinner
    var loading = document.getElementById('data-loading');
    loading.innerHTML = '';

    var monto = entidad.monto != null ? entidad.monto : 0;

    // Agregar la tarjeta de la entidad
    var entidad_card = document.createElement('div');
    entidad_card.classList.add('card');
    entidad_card.classList.add('me-1');
    entidad_card.classList.add('ms-1');
    entidad_card.classList.add('mt-1');
    entidad_card.classList.add('mb-1');
    entidad_card.style.minWidth = '250px';
    entidad_card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${entidad.nombre}</h5>
            <p class="card-text mb-2"><strong>Total:</strong> $${monto.toFixed(2)}</p>
            <div class="d-flex justify-content-end">
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#eliminarEntidadModal" onclick="updateEliminarModal('${entidad.nombre}', ${entidad.id})">Eliminar</button>
                    <button type="button" class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#retirarDepositarModal" onclick="updateRetirarDepositarModal('${entidad.nombre}', ${entidad.id}, 'Retiro')">Retirar</button>
                    <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#retirarDepositarModal" onclick="updateRetirarDepositarModal('${entidad.nombre}', ${entidad.id}, 'Deposito')">Depositar</button>
                </div>
            </div>
        </div>
    `;
    container.appendChild(entidad_card);
}

function updateEliminarModal(nombre, entidad_id){
    // Actualizar el nombre de la entidad
    var entidad_nombre = document.getElementById('entidad-nombre-eliminar');
    entidad_nombre.innerHTML = nombre;

    // Actualizar el id de la funcion de eliminar
    var entidad_id_input = document.getElementById('eliminarEntidadBoton');
    entidad_id_input.innerHTML = `<button type="submit" class="btn btn-danger" onclick="eliminarEntidad(${entidad_id})">Eliminar</button>`
}

function eliminarEntidad(entidad_id){
    // Obtener el token de autenticación
    const token = localStorage.getItem('token');

    // Obtener el id del plazo
    const urlParams = new URLSearchParams(window.location.search);
    const plazo_id = urlParams.get('plazo')

    // Enviar la solicitud para eliminar la entidad
    fetch(API_URL + 'api/plazos/' + plazo_id + '/entidades/' + entidad_id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        toast_message('Entidad eliminada correctamente.', 'Notificación');
        location.reload();
    })
    .catch(error => {
        toast_message('Error al eliminar la entidad', 'Error');
        console.error('¡Hubo un problema con la solicitud!', error);
    });
}

function updateRetirarDepositarModal(nombre, entidad_id, tipo){
    // Actualizar el titulo de el modal
    var tipo_input = document.getElementById('tipo-input');
    tipo_input.value = tipo;

    // Actualizar el nombre de la entidad
    var entidad_input = document.getElementById('entidad-input');
    entidad_input.value = nombre;

    // Actualizar el id de la entidad
    var id_div = document.getElementById('id-retirar-depositar');
    id_div.innerHTML = entidad_id;

    // Actualizar la llamada a la funcion
    if (tipo == 'Retiro'){
        var entidad_id_input = document.getElementById('retirarDepositarBoton');
        entidad_id_input.innerHTML = `<button type="submit" class="btn btn-danger">Retirar</button>`
    }
    if (tipo == 'Deposito'){
        var entidad_id_input = document.getElementById('retirarDepositarBoton');
        entidad_id_input.innerHTML = `<button type="submit" class="btn btn-success">Depositar</button>`
    }
}