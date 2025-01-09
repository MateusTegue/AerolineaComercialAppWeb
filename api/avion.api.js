document.addEventListener("DOMContentLoaded", async () => {
    const formulario = document.getElementById("avionForm");
    const avionTableBody = document.getElementById("avion");
    const tripulacionDropdown = document.getElementById("id_tripulacion");
  

    // configuracion del puerto para conectar frontend con backend
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
     
    // funcion cargar registros de aviones  paramostrarlos en la tabla 
    const cargarAviones = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/avion`);
        const aviones = await response.json();
        avionTableBody.innerHTML = "";
  
        aviones.forEach((avion) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
                        <td>${avion.id_avion}</td>
                        <td>${avion.referencia}</td>
                        <td>${avion.nombre}</td>
                        <td>${avion.modelo}</td>
                        <td>${avion.capacidad}</td>
                        <td>${avion.id_tripulacion}</td>
                        <td class="d-flex justify-content-center">
                            <button class="btn btn-warning btn-sm edit-btn" data-id="${avion.id_avion}">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${avion.id_avion}">
                                <i class="fas fa-trash-alt"></i> Eliminar
                            </button>
                        </td>`;
          avionTableBody.appendChild(tr);
        });
  
        agregarEventos();
      } catch (error) {
        console.error("Error al obtener los destinos:", error);
      }
    };
    
    // funcion para cargar registros de la tripulacion
    const cargarTripulacion = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/tripulacion`);
        const tripulaciones = await response.json();
  
        // Limpiar el dropdown antes de llenarlo
        tripulacionDropdown.innerHTML =
          '<option value="">Seleccione una tripulacion</option>';
  
        tripulaciones.forEach((tripulacion) => {
          const option = document.createElement("option");
          option.value = tripulacion.id_tripulacion;
          option.textContent = tripulacion.codigo;
          tripulacionDropdown.appendChild(option);
        });
      } catch (error) {
        console.error("Error al cargar las tripulaciones:", error);
      }
    };
    
    // eventos para los botones que aparecen en la tabla
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
          const avionId = button.getAttribute("data-id");
          eliminarAvion(avionId);
        });
      });
    };
    
    // funcion para registrar avion
    const registrarAvion = async (event) => {
      event.preventDefault();
      const id_avion = document.getElementById("id_avion").value;
      const referencia = document.getElementById("referencia").value;
      const nombre = document.getElementById("nombre").value;
      const modelo = document.getElementById("modelo").value;
      const capacidad = document.getElementById("capacidad").value;
      const id_tripulacion = tripulacionDropdown.value;
  
      const avionData = { id_avion , referencia, nombre, modelo, capacidad, id_tripulacion };
      try {
        const response = await fetch(`${backendUrl}/api/avion`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(avionData),
        });
        const resultado = await response.json();
        if (response.ok) {
          alert("Avion agregado correctamente");
          cargarAviones();
          formulario.reset();
        } else if (response.status === 409) {
          alert(resultado.mensaje || "El avion ya existe");
        } else {
          alert(resultado.mensaje || "Error al agregar el avion");
        }
      } catch (error) {
        console.error("Error al registrar el avion:", error);
      }
    };
  
    // funcion para eliminar registro
    const eliminarAvion = async (id_avion) => {
      try {
        const response = await fetch(`${backendUrl}/api/avion/${id_avion}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          alert("Avion eliminado correctamente");
          cargarAviones();
        } else {
          alert(`Error al eliminar: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error al eliminar el avion:", error);
      }
    };
  
    // funcion actualizar registro
    const actualizarDestion = async (id_avion) => {
      try {
        // Realizar la solicitud para obtener los datos del destino
        const response = await fetch(`${backendUrl}/api/avion/${id_avion}`);
        const result = await response.json();
    
        if (response.ok) {
          // Llenar los campos del formulario con los datos obtenidos
          document.getElementById("id_avion").value = result.data.id_avion;
          document.getElementById("referencia").value = result.data.referencia;
          document.getElementById("nombre").value = result.data.nombre;
          document.getElementById("modelo").value = result.data.modelo;
          document.getElementById("capacidad").value = result.data.capacidad;
          document.getElementById("id_tripulacion").value = result.data.id_tripulacion;
    
          // Cambiar el texto del botón a "Actualizar"
          const submitButton = document.querySelector('button[type="submit"]');
          submitButton.textContent = "Actualizar";
    
          // Cambiar la acción del formulario a "actualizar"
          formulario.onsubmit = async (event) => {
            event.preventDefault();
    
            const id_avion = document.getElementById("id_avion").value;
            const referencia = document.getElementById("referencia").value;
            const nombre = document.getElementById("nombre").value;
            const modelo = document.getElementById("modelo").value;
            const capacidad = document.getElementById("capacidad").value;
            const id_tripulacion = document.getElementById("id_tripulacion").value
    
            const avionData = { id_avion , referencia, nombre, modelo, capacidad, id_tripulacion };
    
            try {
              // Realizar la solicitud PUT al backend
              const response = await fetch(`${backendUrl}/api/avion/${id_avion}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(avionData),
              });
    
              if (response.ok) {
                alert("Avion actualizado correctamente");
    
                // Recargar los destinos para reflejar los cambios
                cargarAviones();
    
                // Restaurar el formulario al estado original
                submitButton.textContent = "Registrar";
                formulario.onsubmit = registrarAvion;
                formulario.reset();
              } else {
                const errorData = await response.json();
                alert(`Error al actualizar: ${errorData.message || response.statusText}`);
              }
            } catch (error) {
              console.error("Error al actualizar el avion:", error);
              alert("Error al actualizar el avion");
            }
          };
        } else {
          alert("No se pudo obtener los datos del avion.");
        }
      } catch (error) {
        console.error("Error al obtener el avion:", error);
        alert("Error al obtener los datos del avion.");
      }
    };
    
    
  
    formulario.onsubmit = registrarAvion;
    await cargarAviones();
    await cargarTripulacion();
  });
  