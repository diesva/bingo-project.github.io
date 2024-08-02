let cartones = [];
let numerosSacados = [];
let ultimoNumero = null;

function crearCarton() {
    const codigo = document.getElementById('codigoCarton').value.trim();
    if (!codigo) {
        alert('Por favor, ingresa un código para el cartón.');
        return;
    }
    if (cartones.length >= 20) {
        alert('Solo se pueden crear hasta 20 cartones.');
        return;
    }

    let carton = {
        codigo: codigo,
        numeros: [],
        marcado: []
    };

    let formHtml = '<table>';
    ['B', 'I', 'N', 'G', 'O'].forEach(letra => {
        formHtml += `<th>${letra}</th>`;
    });
    
    for (let i = 0; i < 5; i++) {
        formHtml += '<tr>';
        for (let j = 0; j < 5; j++) {
            formHtml += `<td><input type="number" id="carton_${codigo}_${i}_${j}" placeholder="0-99" min="0" max="99"></td>`;
        }
        formHtml += '</tr>';
    }
    formHtml += '</table>';
    formHtml += `<button onclick="guardarCarton('${codigo}')">Guardar Cartón</button>`;

    document.getElementById('cartonForm').innerHTML = formHtml;
}

function guardarCarton(codigo) {
    let numeros = [];
    for (let i = 0; i < 5; i++) {
        let fila = [];
        for (let j = 0; j < 5; j++) {
            let inputId = `carton_${codigo}_${i}_${j}`;
            let valor = document.getElementById(inputId).value;
            if (valor) {
                fila.push(parseInt(valor, 10));
            } else {
                alert('Por favor, completa todos los campos.');
                return;
            }
        }
        numeros.push(fila);
    }

    let carton = {
        codigo: codigo,
        numeros: numeros,
        marcado: Array.from({ length: 5 }, () => Array(5).fill(false))
    };

    cartones.push(carton);
    renderizarCartones();
    document.getElementById('cartonForm').innerHTML = '';
    document.getElementById('codigoCarton').value = '';
}

function renderizarCartones() {
    const numerosCartonesDiv = document.getElementById('numerosCartones');
    numerosCartonesDiv.innerHTML = '';

    cartones.forEach((carton, index) => {
        const table = document.createElement('table');
        const header = document.createElement('tr');
        ['B', 'I', 'N', 'G', 'O'].forEach(letra => {
            const th = document.createElement('th');
            th.textContent = letra;
            header.appendChild(th);
        });
        table.appendChild(header);

        carton.numeros.forEach((fila, i) => {
            const tr = document.createElement('tr');
            fila.forEach((numero, j) => {
                const td = document.createElement('td');
                td.textContent = numero;
                if (carton.marcado[i][j]) {
                    td.classList.add('marked');
                }
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        numerosCartonesDiv.appendChild(table);
    });
}

function marcarNumero() {
    const numero = parseInt(document.getElementById('numeroEntrada').value, 10);
    if (isNaN(numero)) {
        alert('Por favor, ingresa un número válido.');
        return;
    }

    numerosSacados.push(numero);
    ultimoNumero = numero;

    cartones.forEach(carton => {
        carton.numeros.forEach((fila, i) => {
            fila.forEach((num, j) => {
                if (num === numero) {
                    carton.marcado[i][j] = true;
                }
            });
        });
    });

    renderizarCartones();
    verificarGanador();
}

function revertirNumero() {
    if (ultimoNumero === null) {
        alert('No hay ningún número para revertir.');
        return;
    }

    numerosSacados.pop();
    cartones.forEach(carton => {
        carton.numeros.forEach((fila, i) => {
            fila.forEach((num, j) => {
                if (num === ultimoNumero) {
                    carton.marcado[i][j] = false;
                }
            });
        });
    });

    ultimoNumero = numerosSacados.length > 0 ? numerosSacados[numerosSacados.length - 1] : null;
    renderizarCartones();
}

function limpiarNumeros() {
    numerosSacados = [];
    ultimoNumero = null;
    cartones.forEach(carton => {
        carton.marcado = carton.marcado.map(fila => fila.map(() => false));
    });
    renderizarCartones();
}

function verificarGanador() {
    let ganador = null;
    cartones.forEach(carton => {
        if (verificarLleno(carton) || verificarL(carton) || verificarO(carton)) {
            ganador = carton.codigo;
        }
    });

    if (ganador) {
        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.textContent = `¡Cartón ganador! Código: ${ganador}`;
    }
}

function verificarLleno(carton) {
    return carton.marcado.every(fila => fila.every(marcado => marcado));
}

function verificarL(carton) {
    let primeraColumna = carton.marcado.every(fila => fila[0]);
    let ultimaFila = carton.marcado[4].every(marcado => marcado);
    return primeraColumna && ultimaFila;
}

function verificarO(carton) {
    let filasCompletas = carton.marcado.every(fila => fila[0] && fila[4]);
    let columnasCompletas = [0, 4].every(index => carton.marcado.every(fila => fila[index]));
    return filasCompletas || columnasCompletas;
}

document.getElementById('crearCarton').addEventListener('click', crearCarton);
document.getElementById('marcarNumero').addEventListener('click', marcarNumero);
document.getElementById('revertirNumero').addEventListener('click', revertirNumero);
document.getElementById('limpiarNumeros').addEventListener('click', limpiarNumeros);
