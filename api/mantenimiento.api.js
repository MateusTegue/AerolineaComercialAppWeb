document.addEventListener("DOMContentLoaded", async () => {
  const formulario = document.getElementById("mantenimientoForm");
  const mantenimientoTableBody = document.getElementById("mantenimiento");
  const avionDropdown = document.getElementById("id_avion");

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
  
  const cargarMantenimiento = async () => {
      try {
          const response = await fetch(`/api/mantenimiento`);
          const mantenimientos = await response.json();
          mantenimientoTableBody.innerHTML = "";

          mantenimientos.forEach((mantenimiento) => {
              const tr = document.createElement("tr");
              tr.innerHTML = `
                  <td>${mantenimiento.id_mantenimiento}</td>
                  <td>${mantenimiento.descripcion}</td>
                  <td>${mantenimiento.referencia}</td>
                  <td>${mantenimiento.nombre}</td>
                  <td>${mantenimiento.modelo}</td>
                  <td>${mantenimiento.capacidad}</td>
                  <td class="d-flex justify-content-center">
                      <button class="btn btn-warning btn-sm edit-btn" data-id="${mantenimiento.id_mantenimiento}">
                          <i class="fas fa-edit"></i> Editar
                      </button>
                      <button class="btn btn-danger btn-sm delete-btn" data-id="${mantenimiento.id_mantenimiento}">
                          <i class="fas fa-trash-alt"></i> Eliminar
                      </button>
                  </td>`;
              mantenimientoTableBody.appendChild(tr);
          });

          agregarEventos();
      } catch (error) {
          console.error("Error al obtener los destinos:", error);
          Swal.fire("Error", "No se pudieron cargar los mantenimientos", "error");
      }
  };

  const cargarAvion = async () => {
      try {
          const response = await fetch(`/api/avion`);
          const aviones = await response.json();
          avionDropdown.innerHTML = '<option value="">Seleccione un avion</option>';

          aviones.forEach((avion) => {
              const option = document.createElement("option");
              option.value = avion.id_avion;
              option.textContent = avion.id_avion;
              avionDropdown.appendChild(option);
          });
      } catch (error) {
          console.error("Error al cargar los aviones :", error);
          Swal.fire("Error", "No se pudieron cargar los aviones", "error");
      }
  };
  
  const agregarEventos = () => {
      const editButtons = document.querySelectorAll(".edit-btn");
      const deleteButtons = document.querySelectorAll(".delete-btn");

      editButtons.forEach((button) => {
          button.addEventListener("click", () => {
              const id_mantenimiento = button.getAttribute("data-id");
              actualizarMantenimiento(id_mantenimiento);
          });
      });

      deleteButtons.forEach((button) => {
          button.addEventListener("click", () => {
              const mantenimientoId = button.getAttribute("data-id");
              eliminarMantenimiento(mantenimientoId);
          });
      });
  };

  const registrarMantenimiento = async (event) => {
      event.preventDefault();
      const descripcion = document.getElementById("descripcion").value;
      const id_avion = document.getElementById("id_avion").value;

      const mantenimientoData = { descripcion, id_avion };
      try {
          const response = await fetch(`/api/mantenimiento`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(mantenimientoData),
          });
          const resultado = await response.json();
          if (response.ok) {
              Swal.fire("Éxito", "Mantenimiento agregado correctamente", "success");
              cargarMantenimiento();
              formulario.reset();
          } else if (response.status === 409) {
              Swal.fire("Advertencia", resultado.mensaje || "El mantenimiento ya existe", "warning");
          } else {
              Swal.fire("Error", resultado.mensaje || "Error al agregar el mantenimiento", "error");
          }
      } catch (error) {
          console.error("Error al registrar el mantenimiento:", error);
          Swal.fire("Error", "Error al registrar el mantenimiento", "error");
      }
  };

  const eliminarMantenimiento = async (id_mantenimiento) => {
      try {
          const response = await fetch(`/api/mantenimiento/${id_mantenimiento}`, {
              method: "DELETE",
          });

          if (response.ok) {
              Swal.fire("Éxito", "Mantenimiento eliminado correctamente", "success");
              cargarMantenimiento();
          } else {
              Swal.fire("Error", `Error al eliminar: ${response.statusText}`, "error");
          }
      } catch (error) {
          console.error("Error al eliminar el mantenimiento:", error);
          Swal.fire("Error", "Error al eliminar el mantenimiento", "error");
      }
  };

  const actualizarMantenimiento = async (id_mantenimiento) => {
      try {
          const response = await fetch(`/api/mantenimiento/${id_mantenimiento}`);
          const result = await response.json();

          if (response.ok) {
              document.getElementById("descripcion").value = result.data.descripcion;
              document.getElementById("id_avion").value = result.data.id_avion;

              const submitButton = document.querySelector('button[type="submit"]');
              submitButton.textContent = "Actualizar";

              formulario.onsubmit = async (event) => {
                  event.preventDefault();

                  const descripcion = document.getElementById("descripcion").value;
                  const id_avion = document.getElementById("id_avion").value;

                  const mantenimientoData = { descripcion, id_avion };

                  try {
                      const response = await fetch(`/api/mantenimiento/${id_mantenimiento}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(mantenimientoData),
                      });

                      if (response.ok) {
                          Swal.fire("Éxito", "Mantenimiento actualizado correctamente", "success");
                          cargarMantenimiento();

                          submitButton.textContent = "Registrar";
                          formulario.onsubmit = registrarMantenimiento;
                          formulario.reset();
                      } else {
                          const errorData = await response.json();
                          Swal.fire("Error", `Error al actualizar: ${errorData.message || response.statusText}`, "error");
                      }
                  } catch (error) {
                      console.error("Error al actualizar el mantenimiento:", error);
                      Swal.fire("Error", "Error al actualizar el mantenimiento", "error");
                  }
              };
          } else {
              Swal.fire("Error", "No se pudo obtener los datos del mantenimiento.", "error");
          }
      } catch (error) {
          console.error("Error al obtener el mantenimiento:", error);
          Swal.fire("Error", "Error al obtener los datos del mantenimiento.", "error");
      }
  };

  formulario.onsubmit = registrarMantenimiento;
  await cargarAvion();
  await cargarMantenimiento();
});
