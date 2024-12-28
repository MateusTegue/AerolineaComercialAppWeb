document.addEventListener("DOMContentLoaded", async () => {
  const formulario = document.getElementById("destinoForm");
  const destinoTableBody = document.getElementById("destino");
  const aeropuertoDropdown = document.getElementById("id_aeropuerto");

  let backendUrl = "";
  try {
    const configResponse = await fetch("/api/config");
    const config = await configResponse.json();
    backendUrl = `http://localhost:${config.port}`;
  } catch (error) {
    console.error("Error al obtener la información del backend:", error);
    alert("No se pudo obtener la configuración del servidor");
    return;
  }

  const cargarDestinos = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/destino`);
      const destinos = await response.json();
      destinoTableBody.innerHTML = "";

      destinos.forEach((destino) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                      <td>${destino.id_destino}</td>
                      <td>${destino.pais_llegada}</td>
                      <td>${destino.ciudad_llegada}</td>
                      <td>${destino.nombre}</td>
                      <td class="d-flex justify-content-center">
                          <button class="btn btn-warning btn-sm edit-btn" data-id="${destino.id_destino}">
                              <i class="fas fa-edit"></i> Editar
                          </button>
                          <button class="btn btn-danger btn-sm delete-btn" data-id="${destino.id_destino}">
                              <i class="fas fa-trash-alt"></i> Eliminar
                          </button>
                      </td>`;
        destinoTableBody.appendChild(tr);
      });

      agregarEventos();
    } catch (error) {
      console.error("Error al obtener los destinos:", error);
    }
  };

  const cargarAeropuertos = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/aeropuertos`);
      const aeropuertos = await response.json();

      // Limpiar el dropdown antes de llenarlo
      aeropuertoDropdown.innerHTML =
        '<option value="">Seleccione un Aeropuerto</option>';

      aeropuertos.forEach((aeropuerto) => {
        const option = document.createElement("option");
        option.value = aeropuerto.id_aeropuerto;
        option.textContent = aeropuerto.nombre;
        aeropuertoDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar los aeropuertos:", error);
    }
  };

  const agregarEventos = () => {
    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");

    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id_destino= button.getAttribute("data-id");
        actualizarDestion(id_destino);
      });
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const destinoId = button.getAttribute("data-id");
        eliminarDestino(destinoId);
      });
    });
  };

  const registrarDestino = async (event) => {
    event.preventDefault();
    const pais_llegada = document.getElementById("pais_llegada").value;
    const ciudad_llegada = document.getElementById("ciudad_llegada").value;
    const id_aeropuerto = aeropuertoDropdown.value;

    const destinoData = { pais_llegada, ciudad_llegada, id_aeropuerto };
    try {
      const response = await fetch(`${backendUrl}/api/destino`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(destinoData),
      });
      const resultado = await response.json();
      if (response.ok) {
        alert("Destino agregado correctamente");
        cargarDestinos();
        formulario.reset();
      } else if (response.status === 409) {
        alert(resultado.mensaje || "El destino ya existe");
      } else {
        alert(resultado.mensaje || "Error al agregar el destino");
      }
    } catch (error) {
      console.error("Error al registrar el destino:", error);
    }
  };

  // eliminar
  const eliminarDestino = async (id_destino) => {
    try {
      const response = await fetch(`${backendUrl}/api/destino/${id_destino}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Destino eliminado correctamente");
        cargarDestinos();
      } else {
        alert(`Error al eliminar: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error al eliminar el destino:", error);
    }
  };

  const actualizarDestion = async (id_destino) => {
    try {
      // Realizar la solicitud para obtener los datos del destino
      const response = await fetch(`${backendUrl}/api/destino/${id_destino}`);
      const result = await response.json();
  
      if (response.ok) {
        // Llenar los campos del formulario con los datos obtenidos
        document.getElementById("pais_llegada").value = result.data.pais_llegada;
        document.getElementById("ciudad_llegada").value = result.data.ciudad_llegada;
        document.getElementById("id_aeropuerto").value = result.data.id_aeropuerto;
  
        // Cambiar el texto del botón a "Actualizar"
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.textContent = "Actualizar";
  
        // Cambiar la acción del formulario a "actualizar"
        formulario.onsubmit = async (event) => {
          event.preventDefault();
  
          const pais_llegada = document.getElementById("pais_llegada").value;
          const ciudad_llegada = document.getElementById("ciudad_llegada").value;
          const id_aeropuerto = document.getElementById("id_aeropuerto").value;
  
          const destinoData = { pais_llegada, ciudad_llegada, id_aeropuerto };
  
          try {
            // Realizar la solicitud PUT al backend
            const response = await fetch(`${backendUrl}/api/destino/${id_destino}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(destinoData),
            });
  
            if (response.ok) {
              alert("Destino actualizado correctamente");
  
              // Recargar los destinos para reflejar los cambios
              cargarDestinos();
  
              // Restaurar el formulario al estado original
              submitButton.textContent = "Registrar";
              formulario.onsubmit = registrarDestino;
              formulario.reset();
            } else {
              const errorData = await response.json();
              alert(`Error al actualizar: ${errorData.message || response.statusText}`);
            }
          } catch (error) {
            console.error("Error al actualizar el destino:", error);
            alert("Error al actualizar el destino");
          }
        };
      } else {
        alert("No se pudo obtener los datos del destino.");
      }
    } catch (error) {
      console.error("Error al obtener el destino:", error);
      alert("Error al obtener los datos del destino.");
    }
  };
  
  

  formulario.onsubmit = registrarDestino;
  await cargarDestinos();
  await cargarAeropuertos();
});
