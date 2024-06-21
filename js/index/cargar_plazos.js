function cargar_plazos(plazo){
    var contenedor = document.getElementById('data-container');
    var plazo_div = document.createElement('div');

    // Asignar valores predeterminados si son undefined o null
    var num_entidades = plazo.num_entidades || 0;
    var monto = plazo.monto != null ? plazo.monto : 0;

    plazo_div.innerHTML = `
        <a href="plazo.html?plazo=${plazo.id}">
            <li class="table-row">
                <div class="col col-1" data-label="Plazo">${plazo.titulo}</div>
                <div class="col col-2" data-label="Entidades">${num_entidades}</div>
                <div class="col col-3" data-label="Interes">${plazo.interes}%</div>
                <div class="col col-4" data-label="Monto">$${monto.toFixed(2)}</div>
            </li>
        </a>`;
    contenedor.appendChild(plazo_div);
}