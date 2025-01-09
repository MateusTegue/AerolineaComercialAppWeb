document.addEventListener("DOMContentLoaded", async () => {
    const formulario = document.getElementById("tripulacionForm");
    const tripulacionTableBody = document.getElementById("tripulacion");
    const tripulacionDropdown = document.getElementById("id_tripulacion");
  

    // configurar el puerto que conecta el frontend con el backend
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
    
    // funcion para cargar registros de la base de datos
    const cargarTripulacion = async () => {
        try {
          const response = await fetch(`${backendUrl}/api/tripulacion`);
          

          
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
        }
      };
  
    // funcion para agregar evento a los botones de eliminar y editar los cuales aparecen en la tabla 
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
  
  
  
  
    // funcion para cargar registros de los empleados guargados en la base de datos 
    const cargarEmpleados = async () => {
      try {
          const response = await fetch(`${backendUrl}/api/empleados`);
          const empleados = await response.json();
  
          console.log("Empleados recibidos:", empleados); // Depuración
  
          const cedulaDropdown = document.getElementById("numerocedula");
          cedulaDropdown.innerHTML = '<option value="">Seleccione la cédula del empleado</option>';
  
          empleados.forEach((empleado) => {
              const option = document.createElement("option");
              option.value = empleado.numerocedula; // Utiliza id_pasajero
              option.textContent = empleado.numerocedula; // Muestra numerocedula
              cedulaDropdown.appendChild(option);
          });
      } catch (error) {
          console.error("Error al cargar los empleados:", error);
      }
  };
  
  // funcion para registrar datos de la tripulacion en la base de datos 
  const registrarTripulacion = async (event) => {
    event.preventDefault();
    const codigo = document.getElementById("codigo").value;
    const numerocedula = document.getElementById("numerocedula").value;


    const tripulacionData = { codigo , numerocedula };
    console.log("Datos enviados:", tripulacionData);
  
    try {
        const response = await fetch(`${backendUrl}/api/tripulacion`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tripulacionData),
        });
  
        const result = await response.json();
        if (response.ok) {
            alert("Tripulacion registrada con éxito");
            await cargarTripulacion();
            formulario.reset();
        } else if (response.status === 409) {
            alert(result.mensaje || "La tripulacion ya existe");
        } else {
            console.error("Error en respuesta:", result);
            alert("Error al registrar la tripulacion");
        }
    } catch (error) {
        console.error("Error al registrar la tripulacion:", error);
    }
  };
  
  // funcion parar actualizar datos de la tripulacion
  const actualizarTripulacion = async (id_tripulacion) => {
    try {
      // Obtener los detalles de la tripulación por su ID
      const response = await fetch(`${backendUrl}/api/tripulacion/${id_tripulacion}`);
      const tripulacion = await response.json();
  
      if (!response.ok) {
        alert("No se pudo obtener la tripulación para actualizar.");
        return;
      }
  
      // Llenar el formulario con los datos actuales de la tripulación
      document.getElementById("codigo").value = tripulacion.codigo;
      document.getElementById("numerocedula").value = tripulacion.numerocedula;
  
      // Cambiar el comportamiento del formulario para actualizar en lugar de registrar
      formulario.onsubmit = async (event) => {
        event.preventDefault();
  
        const codigo = document.getElementById("codigo").value;
        const numerocedula = document.getElementById("numerocedula").value;
  
        const tripulacionData = { codigo, numerocedula };
  
        try {
          // Enviar la actualización al backend
          const updateResponse = await fetch(`${backendUrl}/api/tripulacion/${id_tripulacion}`, {
            method: "PUT", // O "PATCH" dependiendo de tu API
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tripulacionData),
          });
  
          const result = await updateResponse.json();
  
          if (updateResponse.ok) {
            alert("Tripulación actualizada con éxito");
            await cargarTripulacion();
            formulario.reset();
  
            // Restaurar el comportamiento original del formulario
            formulario.onsubmit = registrarTripulacion;
          } else {
            alert(`Error al actualizar: ${result.mensaje || "Verifique los datos"}`);
          }
        } catch (error) {
          console.error("Error al actualizar la tripulación:", error);
          alert("Error al actualizar la tripulación");
        }
      };
    } catch (error) {
      console.error("Error al cargar la tripulación para actualizar:", error);
      alert("Error al obtener la tripulación");
    }
  };
  
  
  
  // funcion para eliminar registro de tiquete 
  const eliminarTripulacion = async (id_tripulacion) => {
    try {
      const response = await fetch(`${backendUrl}/api/tripulacion/${id_tripulacion}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Tripulacion eliminada correctamente");
        cargarTripulacion();
        formulario.reset();
      } else {
        alert(`Error al eliminar: ${response.statusText}`);
      }
  
    } catch (error) {
      console.error("Error al eliminar la tripulacion:", error);
    }
  }
  
  
  
  
    formulario.onsubmit = registrarTripulacion;
     await cargarTripulacion();
     await cargarEmpleados();
  });
  