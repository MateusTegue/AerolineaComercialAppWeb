document.addEventListener("DOMContentLoaded", async () => {
  const formulario = document.getElementById("viajeForm");
  const viajeTableBody = document.getElementById("viaje");
  const tiqueteDropdown = document.getElementById("id_tiquete");
  const avionDropdown = document.getElementById("id_avion");
  const destinoDropdown = document.getElementById("id_destino");
  const tripulacionDropdown = document.getElementById("id_tripulacion");

  let backendUrl = "";
  try {
    const configResponse = await fetch("/api/config");
    const config = await configResponse.json();
    backendUrl = `http://localhost:${config.port}`;
  } catch (error) {
    console.error("Error al obtener la información del backend:", error);
    Swal.fire("Error", "No se pudo obtener la configuración del servidor", "error");
    return;
  }

  const cargarViaje = async () => {
    try {
      const response = await fetch(`/api/viaje`);
      const viajes = await response.json();
      viajeTableBody.innerHTML = "";

      viajes.forEach((viaje) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${viaje.id_viaje}</td>
          <td>${viaje.pais_salida}</td>
          <td>${viaje.ciudad_salida}</td>
          <td>${viaje.id_tiquete}</td>
          <td>${viaje.id_avion}</td>
          <td>${viaje.id_destino}</td>
          <td>${viaje.id_tripulacion}</td>
          <td class="d-flex justify-content-center">
            <button class="btn btn-warning btn-sm edit-btn" data-id="${viaje.id_viaje}">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${viaje.id_viaje}">
              <i class="fas fa-trash-alt"></i> Eliminar
            </button>
          </td>`;
        viajeTableBody.appendChild(tr);
      });

      agregarEventos();
    } catch (error) {
      console.error("Error al obtener los destinos:", error);
      Swal.fire("Error", "Hubo un problema al cargar los viajes", "error");
    }
  };

  const cargarTiquete = async () => {
    try {
      const response = await fetch(`/api/tiquetes`);
      const tiquetes = await response.json();

      tiqueteDropdown.innerHTML = '<option value="">Seleccione un tiquete</option>';

      tiquetes.forEach((tiquete) => {
        const option = document.createElement("option");
        option.value = tiquete.id_tiquete;
        option.textContent = tiquete.id_tiquete;
        tiqueteDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar los tiquetes:", error);
      Swal.fire("Error", "No se pudo cargar los tiquetes", "error");
    }
  };

  const cargarAvion = async () => {
    try {
      const response = await fetch(`/api/avion`);
      const aviones = await response.json();

      avionDropdown.innerHTML = '<option value="">Seleccione un avión</option>';

      aviones.forEach((avion) => {
        const option = document.createElement("option");
        option.value = avion.id_avion;
        option.textContent = avion.id_avion;
        avionDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar los aviones:", error);
      Swal.fire("Error", "No se pudo cargar los aviones", "error");
    }
  };

  const cargarDestino = async () => {
    try {
      const response = await fetch(`/api/destino`);
      const destinos = await response.json();

      destinoDropdown.innerHTML = '<option value="">Seleccione un destino</option>';

      destinos.forEach((destino) => {
        const option = document.createElement("option");
        option.value = destino.id_destino;
        option.textContent = destino.id_destino;
        destinoDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar los destinos:", error);
      Swal.fire("Error", "No se pudo cargar los destinos", "error");
    }
  };

  const cargarTripulacion = async () => {
    try {
      const response = await fetch(`/api/tripulacion`);
      const tripulaciones = await response.json();

      tripulacionDropdown.innerHTML = '<option value="">Seleccione una tripulación</option>';

      tripulaciones.forEach((tripulacion) => {
        const option = document.createElement("option");
        option.value = tripulacion.id_tripulacion;
        option.textContent = tripulacion.id_tripulacion;
        tripulacionDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar la tripulación:", error);
      Swal.fire("Error", "No se pudo cargar la tripulación", "error");
    }
  };

  const agregarEventos = () => {
    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");

    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id_viaje = button.getAttribute("data-id");
        actualizarViaje(id_viaje);
      });
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const viajeID = button.getAttribute("data-id");
        eliminarViaje(viajeID);
      });
    });
  };

  const registrarViaje = async (event) => {
    event.preventDefault();
    const pais_salida = document.getElementById("pais_salida").value;
    const ciudad_salida = document.getElementById("ciudad_salida").value;
    const id_tiquete = document.getElementById("id_tiquete").value;
    const id_avion = document.getElementById("id_avion").value;
    const id_destino = document.getElementById("id_destino").value;
    const id_tripulacion = document.getElementById("id_tripulacion").value;

    const viajeData = { pais_salida, ciudad_salida, id_tiquete, id_avion, id_destino, id_tripulacion };
    try {
      const response = await fetch(`/api/viaje`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(viajeData),
      });
      const resultado = await response.json();
      if (response.ok) {
        Swal.fire("Éxito", "Viaje agregado correctamente", "success");
        cargarViaje();
        formulario.reset();
      } else if (response.status === 409) {
        Swal.fire("Advertencia", resultado.mensaje || "El viaje ya existe", "warning");
      } else {
        Swal.fire("Error", resultado.mensaje || "Error al agregar el viaje", "error");
      }
    } catch (error) {
      console.error("Error al registrar el viaje:", error);
      Swal.fire("Error", "No se pudo registrar el viaje", "error");
    }
  };

  const eliminarViaje = async (id_viaje) => {
    try {
      const response = await fetch(`${backendUrl}/api/viaje/${id_viaje}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Swal.fire("Éxito", "Viaje eliminado correctamente", "success");
        cargarViaje();
      } else {
        Swal.fire("Error", `Error al eliminar: ${response.statusText}`, "error");
      }
    } catch (error) {
      console.error("Error al eliminar el viaje:", error);
      Swal.fire("Error", "No se pudo eliminar el viaje", "error");
    }
  };

  const actualizarViaje = async (id_viaje) => {
    try {
      const response = await fetch(`${backendUrl}/api/viaje/${id_viaje}`);
      const result = await response.json();

      if (response.ok) {
        document.getElementById("pais_salida").value = result.data.pais_salida;
        document.getElementById("ciudad_salida").value = result.data.ciudad_salida;
        document.getElementById("id_tiquete").value = result.data.id_tiquete;
        document.getElementById("id_avion").value = result.data.id_avion;
        document.getElementById("id_destino").value = result.data.id_destino;
        document.getElementById("id_tripulacion").value = result.data.id_tripulacion;

        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.textContent = "Actualizar";

        formulario.onsubmit = async (event) => {
          event.preventDefault();

          const viajeData = {
            pais_salida: document.getElementById("pais_salida").value,
            ciudad_salida: document.getElementById("ciudad_salida").value,
            id_tiquete: document.getElementById("id_tiquete").value,
            id_avion: document.getElementById("id_avion").value,
            id_destino: document.getElementById("id_destino").value,
            id_tripulacion: document.getElementById("id_tripulacion").value,
          };

          const updateResponse = await fetch(`${backendUrl}/api/viaje/${id_viaje}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(viajeData),
          });

          const updatedResult = await updateResponse.json();

          if (updateResponse.ok) {
            Swal.fire("Éxito", "Viaje actualizado correctamente", "success");
            cargarViaje();
            formulario.reset();
            submitButton.textContent = "Registrar";
            formulario.onsubmit = registrarViaje;
          } else {
            Swal.fire("Error", updatedResult.mensaje || "No se pudo actualizar el viaje", "error");
          }
        };
      }
    } catch (error) {
      console.error("Error al obtener los datos del viaje:", error);
      Swal.fire("Error", "No se pudo cargar los datos del viaje", "error");
    }
  };

  formulario.addEventListener("submit", registrarViaje);

  await cargarTiquete();
  await cargarAvion();
  await cargarDestino();
  await cargarTripulacion();
  await cargarViaje();
});
