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
                <p class="card-text mb-1"><strong>Total:</strong> $${plazo.monto}</p>
                <p class="card-text mb-1"><strong>Interés:</strong> ${plazo.interes}%</p>
                <p class="card-text"><strong>Entidades:</strong> ${plazo.num_entidades}</p>
            </div>
        </div>
    `;

    // Modificar la funcion que llama el boton
    var div_boton = document.getElementById('boton-intereses');
    div_boton.innerHTML = `
        <button  type="button" class="btn btn-primary" onclick="calcular_intereses(${plazo.id})">Confirmar</button>
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
        lista_montos.push(entidad.monto);
        lista_nombres.push(entidad.nombre);

        // Agregar la tarjeta de la entidad
        var entidad_card = document.createElement('div');
        entidad_card.classList.add('card');
        entidad_card.classList.add('me-1');
        entidad_card.classList.add('ms-1');
        entidad_card.classList.add('mt-1');
        entidad_card.classList.add('mb-1');
        entidad_card.style.minWidth = '250px';
        // ! LINKS ACA, 2
        entidad_card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${entidad.nombre}</h5>
                <p class="card-text mb-2"><strong>Total:</strong> $${entidad.monto}</p>
                <div class="d-flex justify-content-end">
                    <div class="btn-group btn-group-sm" role="group">
                        <a class="btn btn-outline-primary" href="">Operaciones</a>
                        <a class="btn btn-outline-success" href="">Acciones</a>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(entidad_card);
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