document.addEventListener("DOMContentLoaded", async () => {
  const formulario = document.getElementById("tripulacionForm");
  const tripulacionTableBody = document.getElementById("tripulacion");
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

  const cargarTripulacion = async () => {
      try {
          const response = await fetch(`/api/tripulacion`);
          const tripulaciones = await response.json();
          tripulacionTableBody.innerHTML = "";

          tripulaciones.forEach((tripulacion) => {
              const tr = document.createElement("tr");
              tr.innerHTML = `
                  <td>${tripulacion.id_tripulacion}</td>
                  <td>${tripulacion.codigo}</td>
                  <td>${tripulacion.numerocedula}</td>
                  <td>${tripulacion.primernombre}</td>
                  <td>${tripulacion.primerapellido}</td>
                  <td class="d-flex justify-content-center">
                      <button class="btn btn-warning btn-sm edit-btn" data-id="${tripulacion.id_tripulacion}">
                          <i class="fas fa-edit"></i> Editar
                      </button>
                      <button class="btn btn-danger btn-sm delete-btn" data-id="${tripulacion.id_tripulacion}">
                          <i class="fas fa-trash-alt"></i> Eliminar
                      </button>
                  </td>`;
              tripulacionTableBody.appendChild(tr);
              agregarEventos();
          });
      } catch (error) {
          console.error("Error al cargar las tripulaciones:", error);
          Swal.fire("Error", "Error al cargar las tripulaciones", "error");
      }
  };

  const agregarEventos = () => {
      const editButtons = document.querySelectorAll(".edit-btn");
      const deleteButtons = document.querySelectorAll(".delete-btn");

      editButtons.forEach((button) => {
          button.addEventListener("click", () => {
              const id_tripulacion = button.getAttribute("data-id");
              actualizarTripulacion(id_tripulacion);
          });
      });

      deleteButtons.forEach((button) => {
          button.addEventListener("click", () => {
              const tripulacionid = button.getAttribute("data-id");
              eliminarTripulacion(tripulacionid);
          });
      });
  };

  const cargarEmpleados = async () => {
      try {
          const response = await fetch(`/api/empleados`);
          const empleados = await response.json();

          console.log("Empleados recibidos:", empleados); // Depuración

          const cedulaDropdown = document.getElementById("numerocedula");
          cedulaDropdown.innerHTML = '<option value="">Seleccione la cédula del empleado</option>';

          empleados.forEach((empleado) => {
              const option = document.createElement("option");
              option.value = empleado.numerocedula;
              option.textContent = empleado.numerocedula;
              cedulaDropdown.appendChild(option);
          });
      } catch (error) {
          console.error("Error al cargar los empleados:", error);
          Swal.fire("Error", "Error al cargar los empleados", "error");
      }
  };

  const registrarTripulacion = async (event) => {
      event.preventDefault();
      const codigo = document.getElementById("codigo").value;
      const numerocedula = document.getElementById("numerocedula").value;

      const tripulacionData = { codigo, numerocedula };
      console.log("Datos enviados:", tripulacionData);

      try {
          const response = await fetch(`/api/tripulacion`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(tripulacionData),
          });

          const result = await response.json();
          if (response.ok) {
              Swal.fire("Éxito", "Tripulacion registrada con éxito", "success");
              await cargarTripulacion();
              formulario.reset();
          } else if (response.status === 409) {
              Swal.fire("Error", result.mensaje || "La tripulacion ya existe", "error");
          } else {
              console.error("Error en respuesta:", result);
              Swal.fire("Error", "Error al registrar la tripulacion", "error");
          }
      } catch (error) {
          console.error("Error al registrar la tripulacion:", error);
          Swal.fire("Error", "Error al registrar la tripulacion", "error");
      }
  };

  const actualizarTripulacion = async (id_tripulacion) => {
      try {
          const response = await fetch(`/api/tripulacion/${id_tripulacion}`);
          const tripulacion = await response.json();

          if (!response.ok) {
              Swal.fire("Error", "No se pudo obtener la tripulación para actualizar.", "error");
              return;
          }

          document.getElementById("codigo").value = tripulacion.codigo;
          document.getElementById("numerocedula").value = tripulacion.numerocedula;

          formulario.onsubmit = async (event) => {
              event.preventDefault();

              const codigo = document.getElementById("codigo").value;
              const numerocedula = document.getElementById("numerocedula").value;

              const tripulacionData = { codigo, numerocedula };

              try {
                  const updateResponse = await fetch(`/api/tripulacion/${id_tripulacion}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(tripulacionData),
                  });

                  const result = await updateResponse.json();

                  if (updateResponse.ok) {
                      Swal.fire("Éxito", "Tripulación actualizada con éxito", "success");
                      await cargarTripulacion();
                      formulario.reset();
                      formulario.onsubmit = registrarTripulacion;
                  } else {
                      Swal.fire("Error", `Error al actualizar: ${result.mensaje || "Verifique los datos"}`, "error");
                  }
              } catch (error) {
                  console.error("Error al actualizar la tripulación:", error);
                  Swal.fire("Error", "Error al actualizar la tripulación", "error");
              }
          };
      } catch (error) {
          console.error("Error al cargar la tripulación para actualizar:", error);
          Swal.fire("Error", "Error al obtener la tripulación", "error");
      }
  };

  const eliminarTripulacion = async (id_tripulacion) => {
      try {
          const response = await fetch(`/api/tripulacion/${id_tripulacion}`, {
              method: "DELETE",
          });
          if (response.ok) {
              Swal.fire("Éxito", "Tripulacion eliminada correctamente", "success");
              cargarTripulacion();
              formulario.reset();
          } else {
              Swal.fire("Error", `Error al eliminar: ${response.statusText}`, "error");
          }
      } catch (error) {
          console.error("Error al eliminar la tripulacion:", error);
          Swal.fire("Error", "Error al eliminar la tripulacion", "error");
      }
  };

  formulario.onsubmit = registrarTripulacion;
  await cargarTripulacion();
  await cargarEmpleados();
});
