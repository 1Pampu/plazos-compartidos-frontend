function cargar_plazos(plazo){
    var contenedor = document.getElementById('data-container');
    var plazo_div = document.createElement('div');
    plazo_div.innerHTML = `
        <a href="plazo.html?plazo=${plazo.id}" class="text-decoration-none">
            <div class="alert alert-secondary mb-2">
                <div class="d-flex justify-content-end">
                    <p class="mb-0 me-auto ms-3">${plazo.titulo}</p>
                    <p class="mb-0 me-5 ms-3">${plazo.num_entidades}</p>
                    <p class="mb-0 me-5 ms-3">${plazo.interes}%</p>
                    <p class="mb-0 me-3 ms-3">$${plazo.monto}</p>
                </div>
            </div>
        </a>`;
    contenedor.appendChild(plazo_div);
}