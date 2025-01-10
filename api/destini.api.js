document.addEventListener("DOMContentLoaded", async () => {
  const formulario = document.getElementById("destinoForm");
  const destinoTableBody = document.getElementById("destino");
  const aeropuertoDropdown = document.getElementById("id_aeropuerto");
  
  // Configuración del puerto que conecta el frontend y el backend
  let backendUrl = "";
  try {
    const configResponse = await fetch("/api/config");
    const config = await configResponse.json();
    backendUrl = `http://localhost:${config.port}`;
  } catch (error) {
    console.error("Error al obtener la información del backend:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo obtener la configuración del servidor",
    });
    return;
  }

  // Función para cargar los registros de destinos desde la base de datos
  const cargarDestinos = async () => {
    try {
      const response = await fetch(`/api/destino`);
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
      console.log("Error al obtener los destinos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo obtener la información de los destinos",
      });
    }
  };

  // Función para cargar los aeropuertos en el dropdown
  const cargarAeropuertos = async () => {
    try {
      const response = await fetch(`/api/aeropuertos`);
      const aeropuertos = await response.json();

      aeropuertoDropdown.innerHTML = '<option value="">Seleccione un Aeropuerto</option>';

      aeropuertos.forEach((aeropuerto) => {
        const option = document.createElement("option");
        option.value = aeropuerto.id_aeropuerto;
        option.textContent = aeropuerto.nombre;
        aeropuertoDropdown.appendChild(option);
      });
    } catch (error) {
      console.log("Error al cargar los aeropuertos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la información de los aeropuertos",
      });
    }
  };

  // Función para agregar los eventos de editar y eliminar
  const agregarEventos = () => {
    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");

    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id_destino = button.getAttribute("data-id");
        actualizarDestino(id_destino);
      });
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const destinoId = button.getAttribute("data-id");
        Swal.fire({
          title: "¿Estás seguro?",
          text: "¡No podrás revertir esto!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            eliminarDestino(destinoId);
          }
        });
      });
    });
  };

  // Función para registrar destinos
  const registrarDestino = async (event) => {
    event.preventDefault();
    const pais_llegada = document.getElementById("pais_llegada").value;
    const ciudad_llegada = document.getElementById("ciudad_llegada").value;
    const id_aeropuerto = aeropuertoDropdown.value;

    const destinoData = { pais_llegada, ciudad_llegada, id_aeropuerto };
    try {
      const response = await fetch(`/api/destino`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(destinoData),
      });
      const resultado = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Destino agregado",
          text: "El destino ha sido agregado correctamente",
        });
        cargarDestinos();
        formulario.reset();
      } else if (response.status === 409) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: resultado.mensaje || "El destino ya existe",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: resultado.mensaje || "Error al agregar el destino",
        });
      }
    } catch (error) {
      console.log("Error al registrar el destino:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar el destino",
      });
    }
  };

  // Función para eliminar destino
  const eliminarDestino = async (id_destino) => {
    try {
      const response = await fetch(`/api/destino/${id_destino}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Destino eliminado",
          text: "El destino ha sido eliminado correctamente",
        });
        cargarDestinos();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Error al eliminar: ${response.statusText}`,
        });
      }
    } catch (error) {
      console.log("Error al eliminar el destino:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al eliminar el destino",
      });
    }
  };

  // Función para actualizar destino
  const actualizarDestino = async (id_destino) => {
    try {
      const response = await fetch(`/api/destino/${id_destino}`);
      const result = await response.json();

      if (response.ok) {
        document.getElementById("pais_llegada").value = result.data.pais_llegada;
        document.getElementById("ciudad_llegada").value = result.data.ciudad_llegada;
        document.getElementById("id_aeropuerto").value = result.data.id_aeropuerto;

        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.textContent = "Actualizar";

        formulario.onsubmit = async (event) => {
          event.preventDefault();

          const pais_llegada = document.getElementById("pais_llegada").value;
          const ciudad_llegada = document.getElementById("ciudad_llegada").value;
          const id_aeropuerto = document.getElementById("id_aeropuerto").value;

          const destinoData = { pais_llegada, ciudad_llegada, id_aeropuerto };

          try {
            const response = await fetch(`/api/destino/${id_destino}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(destinoData),
            });

            if (response.ok) {
              Swal.fire({
                icon: "success",
                title: "Destino actualizado",
                text: "El destino ha sido actualizado correctamente",
              });
              cargarDestinos();
              submitButton.textContent = "Registrar";
              formulario.onsubmit = registrarDestino;
              formulario.reset();
            } else {
              const errorData = await response.json();
              Swal.fire({
                icon: "error",
                title: "Error",
                text: `Error al actualizar: ${errorData.message || response.statusText}`,
              });
            }
          } catch (error) {
            console.error("Error al actualizar el destino:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error al actualizar el destino",
            });
          }
        };
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener los datos del destino.",
        });
      }
    } catch (error) {
      console.error("Error al obtener el destino:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al obtener los datos del destino.",
      });
    }
  };

  formulario.onsubmit = registrarDestino;
  await cargarDestinos();
  await cargarAeropuertos();
});
