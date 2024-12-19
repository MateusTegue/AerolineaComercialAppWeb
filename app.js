document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('aeropuertoForm');
    if (formulario) {
        formulario.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const ciudad = document.getElementById('ciudad').value;
            const pais = document.getElementById('pais').value;

            const aeropuertoData = { nombre, ciudad, pais };

            try {
                const response = await fetch('http://localhost:8000/api/aeropuertos', {
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
