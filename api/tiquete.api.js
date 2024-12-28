document.addEventListener("DOMContentLoaded", async () => {
  const formulario = document.getElementById("tiqueteForm");
  const tiqueteTableBody = document.getElementById("tiquetes");
  const tiqueteDropdown = document.getElementById("id_tiquete");

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

  const cargarTiquetes = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/tiquetes`);
      const tiquetes = await response.json();
      tiqueteTableBody.innerHTML = "";

      tiquetes.forEach((tiquete) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                      <td>${tiquete.id_tiquete}</td>
                      <td>${tiquete.fecha}</td>
                      <td>${tiquete.numerocedula}</td>
                      <td>${tiquete.primernombre}</td>
                      <td>${tiquete.primerapellido}</td>
                      <td class="d-flex justify-content-center">
                          <button class="btn btn-warning btn-sm edit-btn" data-id="${tiquete.id_tiquete}">
                              <i class="fas fa-edit"></i> Editar
                          </button>
                          <button class="btn btn-danger btn-sm delete-btn" data-id="${tiquete.id_tiquete}">
                              <i class="fas fa-trash-alt"></i> Eliminar
                          </button>
                      </td>`;
        tiqueteTableBody.appendChild(tr);
      });  
      agregarEventos();
    } catch (error) {
      console.error("Error al obtener los tiquetes:", error);
    }
  };

  // botones 
  const agregarEventos = () => {
    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");

    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id_tiquete= button.getAttribute("data-id");
        actualizarTiquete(id_tiquete);
      });
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tiqueteid = button.getAttribute("data-id");
        eliminarTiquete(tiqueteid);
      });
    });
  };





  const cargarPasajero = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/pasajeros`);
        const pasajeros = await response.json();

        console.log("Pasajeros recibidos:", pasajeros); // Depuración

        const cedulaDropdown = document.getElementById("numerocedula");
        cedulaDropdown.innerHTML = '<option value="">Seleccione la cédula del pasajero</option>';

        pasajeros.forEach((pasajero) => {
            const option = document.createElement("option");
            option.value = pasajero.id_pasajero; // Utiliza id_pasajero
            option.textContent = pasajero.numerocedula; // Muestra numerocedula
            cedulaDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar los pasajeros:", error);
    }
};

const registrarTiquete = async (event) => {
  event.preventDefault();
  const fecha = document.getElementById("fecha").value;
  const numerocedula = document.getElementById("numerocedula").value;

  // Asegúrate de que numerocedula sea el ID del pasajero
  const id_pasajero = numerocedula;

  // Formatear la fecha a un formato ISO válido
  const fechaFormateada = new Date(fecha).toISOString().split("T")[0];

  // Enviar los datos correctos al backend
  const tiqueteData = { fecha: fechaFormateada, id_pasajero };
  console.log("Datos enviados:", tiqueteData);

  try {
      const response = await fetch(`${backendUrl}/api/tiquetes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tiqueteData),
      });

      const result = await response.json();
      if (response.ok) {
          alert("Tiquete registrado con éxito");
          await cargarTiquetes();
          formulario.reset();
      } else if (response.status === 409) {
          alert(result.mensaje || "El tiquete ya existe");
      } else {
          console.error("Error en respuesta:", result);
          alert("Error al registrar el tiquete");
      }
  } catch (error) {
      console.error("Error al registrar el tiquete:", error);
  }
};

///////////////////////////////////////////////////////////////
const actualizarTiquete = async (id_tiquete) => {
  try {
    // Obtener los detalles del tiquete
    const response = await fetch(`${backendUrl}/api/tiquetes/${id_tiquete}`);
    const tiquete = await response.json();

    if (!response.ok) {
      alert("No se pudo obtener el tiquete para actualizar.");
      return;
    }

    // Llenar el formulario con los datos del tiquete
    document.getElementById("fecha").value = tiquete.fecha;

    // Obtener el id del pasajero y cargarlo en el dropdown de cédulas
    const cedulaDropdown = document.getElementById("numerocedula");
    cedulaDropdown.value = tiquete.id_pasajero; // Asegúrate de que el id_pasajero esté en tiquete

    // Si es necesario, cargar los pasajeros para actualizar la lista de cédulas
    await cargarPasajero();

    // Cambiar el comportamiento del formulario para actualizar en lugar de crear
    formulario.onsubmit = async (event) => {
      event.preventDefault();
      
      const fecha = document.getElementById("fecha").value;
      const numerocedula = document.getElementById("numerocedula").value;

      // El id_pasajero es lo que deberías enviar
      const id_pasajero = numerocedula;
      const fechaFormateada = new Date(fecha).toISOString().split("T")[0];

      const tiqueteData = { fecha: fechaFormateada, numerocedula: id_pasajero };  // Enviar numerocedula en lugar de id_pasajero
      
      try {
        // Enviar la actualización al backend
        const updateResponse = await fetch(`${backendUrl}/api/tiquetes/${id_tiquete}`, {
          method: "PUT", // O "PATCH" dependiendo de la API
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tiqueteData),
        });

        const result = await updateResponse.json();
        
        if (updateResponse.ok) {
          alert("Tiquete actualizado con éxito");
          await cargarTiquetes();
          formulario.reset();
        } else {
          alert(`Error al actualizar: ${result.mensaje || "Verifique los datos"}`);
        }
      } catch (error) {
        console.error("Error al actualizar el tiquete:", error);
        alert("Error al actualizar el tiquete");
      }
    };
  } catch (error) {
    console.error("Error al cargar el tiquete para actualizar:", error);
    alert("Error al obtener el tiquete");
  }
};



// eliminar tiquete 
const eliminarTiquete = async (id_tiquete) => {
  try {
    const response = await fetch(`${backendUrl}/api/tiquetes/${id_tiquete}`, {
      method: "DELETE",
    });
    if (response.ok) {
      alert("Tiquete eliminado correctamente");
      cargarTiquetes();
    } else {
      alert(`Error al eliminar: ${response.statusText}`);
    }

  } catch (error) {
    console.error("Error al eliminar el tiquete:", error);
  }
}




  formulario.onsubmit = registrarTiquete;
  await cargarPasajero();
  await cargarTiquetes();
});
