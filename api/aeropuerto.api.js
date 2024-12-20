

document.addEventListener('DOMContentLoaded', async () => {
    const formulario = document.getElementById('aeropuertoForm');
    const aeropuertoTableBody = document.getElementById('aeropuerto');

    // Obtener el puerto dinámico desde el backend
    let backendUrl = '';
    try {
        const configResponse = await fetch('/api/config');
        const config = await configResponse.json();
        backendUrl = `http://localhost:${config.port}`;
    } catch (error) {
        console.error('Error al obtener la configuración del backend:', error);
        alert('No se pudo obtener la configuración del servidor.');
        return;
    }


// funcion para cargar los datos desde el backend
const cargarAeropuerto = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/aeropuertos`);
        const aeropuertos = await response.json();
        // limpiar la tabla antes de cargar los nuevos datos 
        aeropuertoTableBody.innerHTML = '';

        // agregar los registroas a la tabla
        aeropuertos.forEach(aeropuerto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${aeropuerto.id_aeropuerto}</td>
                <td>${aeropuerto.nombre}</td>
                <td>${aeropuerto.ciudad}</td>
                <td>${aeropuerto.pais}</td>`;
            
            aeropuertoTableBody.appendChild(tr);
        });
        } catch (error) {
            console.error('Error al cargar los aeropuertos:', error);
            alert('No se pudo cargar la información de los aeropuertos.');
            }
    };
    
    // llamar a la funcion para cargar los datos
    cargarAeropuerto();

    if (formulario) {
        formulario.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const ciudad = document.getElementById('ciudad').value;
            const pais = document.getElementById('pais').value;

            const aeropuertoData = { nombre, ciudad, pais };

            try {
                const response = await fetch(`${backendUrl}/api/aeropuertos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(aeropuertoData),
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Aeropuerto registrado correctamente');
                } else {
                    alert(`Error: ${result.mensaje}`);
                }
            } catch (error) {
                console.error('Error al registrar el aeropuerto:', error);
                alert('Ocurrió un error al enviar los datos. Inténtalo nuevamente.');
            }
        });
    }
});

