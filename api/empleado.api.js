document.addEventListener("DOMContentLoaded", async () => {
  const formulario = document.getElementById("empleadoForm");
  const empleadoTableBody = document.getElementById("empleado");

  // configuración del puerto que conecta el frontend y el backend
  let backendUrl = "";
  try {
      const configResponse = await fetch("/api/config");
      const config = await configResponse.json();
      backendUrl = `http://localhost:${config.port}`;
  } catch (error) {
      console.error("Error al obtener la configuración del backend:", error);
      Swal.fire('Error', 'No se pudo obtener la configuración del servidor.', 'error');
      return;
  }

  // función para cargar registros de la base de datos
  const cargarEmpleados = async () => {
      try {
          const response = await fetch(`/api/empleados`);
          const empleados = await response.json();
          empleadoTableBody.innerHTML = "";

          empleados.forEach((empleado) => {
              const tr = document.createElement("tr");
              tr.innerHTML = `
                  <td>${empleado.numerocedula}</td>
                  <td>${empleado.primernombre}</td>
                  <td>${empleado.segundonombre}</td>
                  <td>${empleado.primerapellido}</td>
                  <td>${empleado.segundoapellido}</td>
                  <td>${empleado.numerotelefono}</td>
                  <td>${empleado.correo}</td>
                  <td>${empleado.cargo}</td>
                  <td class="d-flex justify-content-center">
                      <button class="btn btn-warning btn-sm edit-btn" data-id="${empleado.numerocedula}">
                          <i class="fas fa-edit"></i> Editar
                      </button>
                      <button class="btn btn-danger btn-sm delete-btn" data-id="${empleado.numerocedula}">
                          <i class="fas fa-trash-alt"></i> Eliminar
                      </button>
                  </td>`;
              empleadoTableBody.appendChild(tr);
          });

          agregarEventos();
      } catch (error) {
          console.error("Error al cargar los pasajeros:", error);
          Swal.fire('Error', 'No se pudo cargar la lista de empleados.', 'error');
      }
  };

  // eventos para los botones que están disponibles en el formulario
  const agregarEventos = () => {
      const editButtons = document.querySelectorAll(".edit-btn");
      const deleteButtons = document.querySelectorAll(".delete-btn");

      editButtons.forEach((button) => {
          button.addEventListener("click", () => {
              const empleadoid = button.getAttribute("data-id");
              editarEmpleado(empleadoid);
          });
      });

      deleteButtons.forEach((button) => {
          button.addEventListener("click", () => {
              const empleadoid = button.getAttribute("data-id");
              eliminarEmpleado(empleadoid);
          });
      });
  };

  // función para actualizar registros
  const editarEmpleado = async (numerocedula) => {
      try {
          const response = await fetch(`/api/empleados/${numerocedula}`);
          const result = await response.json();

          if (response.ok) {
              document.getElementById("numerocedula").value = result.data.numerocedula;
              document.getElementById("primernombre").value = result.data.primernombre;
              document.getElementById("segundonombre").value = result.data.segundonombre;
              document.getElementById("primerapellido").value = result.data.primerapellido;
              document.getElementById("segundoapellido").value = result.data.segundoapellido;
              document.getElementById("numerotelefono").value = result.data.numerocedula;
              document.getElementById("correo").value = result.data.correo;
              document.getElementById("cargo").value = result.data.cargo;

              const submitButton = document.querySelector('button[type="submit"]');
              submitButton.textContent = "Actualizar";

              formulario.onsubmit = async (event) => {
                  event.preventDefault();

                  const numerocedula = document.getElementById("numerocedula").value;
                  const primernombre = document.getElementById("primernombre").value;
                  const segundonombre = document.getElementById("segundonombre").value;
                  const primerapellido = document.getElementById("primerapellido").value;
                  const segundoapellido = document.getElementById("segundoapellido").value;
                  const numerotelefono = document.getElementById("numerotelefono").value;
                  const correo = document.getElementById("correo").value;
                  const cargo = document.getElementById("cargo").value;

                  const empleadoData = { numerocedula, primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo, cargo };

                  try {
                      const response = await fetch(`/api/empleados/${numerocedula}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(empleadoData),
                      });

                      if (response.ok) {
                          Swal.fire('Éxito', 'Empleado actualizado correctamente', 'success');
                          cargarEmpleados();
                          formulario.reset();
                          submitButton.textContent = "Registrar";
                          formulario.onsubmit = registrarEmpleados;
                      } else {
                          Swal.fire('Error', `Error al actualizar: ${response.statusText}`, 'error');
                      }
                  } catch (error) {
                      console.error("Error al actualizar el empleado:", error);
                      Swal.fire('Error', 'No se pudo actualizar el empleado', 'error');
                  }
              };
          }
      } catch (error) {
          console.error("Error al obtener los datos del empleado:", error);
          Swal.fire('Error', 'No se pudo obtener la información del empleado', 'error');
      }
  };

  // función para eliminar registros de la base de datos
  const eliminarEmpleado = async (numerocedula) => {
      try {
          const response = await fetch(`/api/empleados/${numerocedula}`, {
              method: "DELETE",
          });

          if (response.ok) {
              Swal.fire('Éxito', 'Empleado eliminado correctamente', 'success');
              cargarEmpleados();
              formulario.reset();
          } else {
              Swal.fire('Error', `Error al eliminar: ${response.statusText}`, 'error');
          }
      } catch (error) {
          console.error("Error al eliminar el empleado: ", error);
          Swal.fire('Error', 'No se pudo eliminar el empleado', 'error');
      }
  };

  // función para registrar empleados en la base de datos
  const registrarEmpleados = async (event) => {
      event.preventDefault();

      const numerocedula = document.getElementById("numerocedula").value;
      const primernombre = document.getElementById("primernombre").value;
      const segundonombre = document.getElementById("segundonombre").value;
      const primerapellido = document.getElementById("primerapellido").value;
      const segundoapellido = document.getElementById("segundoapellido").value;
      const numerotelefono = document.getElementById("numerotelefono").value;
      const correo = document.getElementById("correo").value;
      const cargo = document.getElementById("cargo").value;

      const datosEmpleados = { numerocedula, primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo, cargo };

      try {
          const response = await fetch(`/api/empleados`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(datosEmpleados),
          });

          const result = await response.json();
          if (response.ok) {
              Swal.fire('Éxito', 'Empleado registrado con éxito.', 'success');
              cargarEmpleados();
              formulario.reset();
          } else if (response.status === 409) {
              Swal.fire('Error', result.mensaje || "El empleado ya existe.", 'error');
          } else {
              Swal.fire('Error', result.mensaje || "Error al registrar el empleado.", 'error');
          }

      } catch (error) {
          console.error("Error al registrar el empleado:", error);
          Swal.fire('Error', 'No se pudo enviar la solicitud. Inténtelo nuevamente', 'error');
      }
  };

  formulario.onsubmit = registrarEmpleados;
  cargarEmpleados();
});
