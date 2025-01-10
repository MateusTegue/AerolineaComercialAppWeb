document.addEventListener("DOMContentLoaded", async () => {
  const formulario = document.getElementById("tiqueteForm");
  const tiqueteTableBody = document.getElementById("tiquetes");
  const tiqueteDropdown = document.getElementById("id_tiquete");

  // configurara el puerto que conecta el frontend con el backend
  let backendUrl = "";
  try {
    const configResponse = await fetch("/api/config");
    const config = await configResponse.json();
    backendUrl = `http://localhost:${config.port}`;
  } catch (error) {
    console.error("Error al obtener la información del backend:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo obtener la configuración del servidor',
    });
    return;
  }

  // Función para cargar registros de la base de datos
  const cargarTiquetes = async () => {
    try {
      const response = await fetch(`/api/tiquetes`);
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar los tiquetes',
      });
    }
  };

  // Función para agregar evento a los botones de editar y eliminar
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

  // Función para cargar los pasajeros en el dropdown
  const cargarPasajero = async () => {
    try {
        const response = await fetch(`/api/pasajeros`);
        const pasajeros = await response.json();
        const cedulaDropdown = document.getElementById("numerocedula");
        cedulaDropdown.innerHTML = '<option value="">Seleccione la cédula del pasajero</option>';

        pasajeros.forEach((pasajero) => {
            const option = document.createElement("option");
            option.value = pasajero.id_pasajero;
            option.textContent = pasajero.numerocedula;
            cedulaDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar los pasajeros:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar los pasajeros',
        });
    }
  };

  // Función para registrar tiquete
  const registrarTiquete = async (event) => {
    event.preventDefault();
    const fecha = document.getElementById("fecha").value;
    const numerocedula = document.getElementById("numerocedula").value;
    const id_pasajero = numerocedula;
    const fechaFormateada = new Date(fecha).toISOString().split("T")[0];
    const tiqueteData = { fecha: fechaFormateada, id_pasajero };
    
    try {
        const response = await fetch(`/api/tiquetes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tiqueteData),
        });

        const result = await response.json();
        if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Tiquete Registrado',
              text: 'El tiquete ha sido registrado con éxito.',
            });
            await cargarTiquetes();
            formulario.reset();
        } else if (response.status === 409) {
            Swal.fire({
              icon: 'error',
              title: 'Conflicto',
              text: result.mensaje || "El tiquete ya existe",
            });
        } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al registrar el tiquete',
            });
        }
    } catch (error) {
        console.error("Error al registrar el tiquete:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el tiquete',
        });
    }
  };

  // Función para actualizar tiquete
  const actualizarTiquete = async (id_tiquete) => {
    try {
      const response = await fetch(`/api/tiquetes/${id_tiquete}`);
      const tiquete = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener el tiquete para actualizar',
        });
        return;
      }

      document.getElementById("fecha").value = tiquete.fecha;
      const cedulaDropdown = document.getElementById("numerocedula");
      cedulaDropdown.value = tiquete.id_pasajero;
      await cargarPasajero();

      formulario.onsubmit = async (event) => {
        event.preventDefault();
        const fecha = document.getElementById("fecha").value;
        const numerocedula = document.getElementById("numerocedula").value;
        const id_pasajero = numerocedula;
        const fechaFormateada = new Date(fecha).toISOString().split("T")[0];
        const tiqueteData = { fecha: fechaFormateada, numerocedula: id_pasajero };

        try {
          const updateResponse = await fetch(`/api/tiquetes/${id_tiquete}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tiqueteData),
          });

          const result = await updateResponse.json();
          
          if (updateResponse.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Tiquete Actualizado',
              text: 'El tiquete ha sido actualizado con éxito.',
            });
            await cargarTiquetes();
            formulario.reset();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: result.mensaje || "Verifique los datos",
            });
          }
        } catch (error) {
          console.error("Error al actualizar el tiquete:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el tiquete',
          });
        }
      };
    } catch (error) {
      console.error("Error al cargar el tiquete para actualizar:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el tiquete',
      });
    }
  };

  // Función para eliminar tiquete
  const eliminarTiquete = async (id_tiquete) => {
    try {
      const response = await fetch(`/api/tiquetes/${id_tiquete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Tiquete Eliminado',
          text: 'El tiquete ha sido eliminado correctamente.',
        });
        cargarTiquetes();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al eliminar: ${response.statusText}`,
        });
      }
    } catch (error) {
      console.error("Error al eliminar el tiquete:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el tiquete',
      });
    }
  };

  formulario.onsubmit = registrarTiquete;
  await cargarPasajero();
  await cargarTiquetes();
});
