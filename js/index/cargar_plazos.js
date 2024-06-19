function cargar_plazos(plazo){
    var contenedor = document.getElementById('data-container');
    var plazo_div = document.createElement('div');
    plazo_div.innerHTML = `
        <a href="plazo.html?plazo=${plazo.id}">
            <li class="table-row">
                <div class="col col-1" data-label="Job Id">${plazo.titulo}</div>
                <div class="col col-2" data-label="Customer Name">${plazo.num_entidades}</div>
                <div class="col col-3" data-label="Amount">${plazo.interes}%</div>
                <div class="col col-4" data-label="Payment Status">$${plazo.monto.toFixed(2)}</div>
            </li>
        </a>`;
    contenedor.appendChild(plazo_div);
}

