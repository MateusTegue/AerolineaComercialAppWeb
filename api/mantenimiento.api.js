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
      alert("No se pudo obtener la configuración del servidor");
      return;
    }
    
    // cargar los registros de mantenimiento 
    const cargarMantenimiento = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/mantenimiento`);
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
      }
    };
   
    // cargar los registros de los aviones 
    const cargarAvion = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/avion`);
        const aviones = await response.json();
  
        // Limpiar el dropdown antes de llenarlo
        avionDropdown.innerHTML =
          '<option value="">Seleccione un avion</option>';
  
          aviones.forEach((avion) => {
          const option = document.createElement("option");
          option.value = avion.id_avion;
          option.textContent = avion.id_avion;
          avionDropdown.appendChild(option);
        });
      } catch (error) {
        console.error("Error al cargar los aviones :", error);
      }
    };
    
    // eventos para los botones que aparecen la la tabla con los registros 
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
  
    // registrar mantenimientos 
    const registrarMantenimiento = async (event) => {
      event.preventDefault();
      const descripcion = document.getElementById("descripcion").value;
      const id_avion = document.getElementById("id_avion").value;

    
      const mantenimientoData = { descripcion , id_avion };
        try {
          const response = await fetch(`${backendUrl}/api/mantenimiento`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mantenimientoData),
          });
          const resultado = await response.json();
          if (response.ok) {
            alert("Mantenimiento agregado correctamente");
            cargarMantenimiento();
            formulario.reset();
          } else if (response.status === 409) {
            alert(resultado.mensaje || "El mantenimiento ya existe");
          } else {
            alert(resultado.mensaje || "Error al agregar el mantenimiento");
          }
        } catch (error) {
          console.error("Error al registrar el mantenimiento:", error);
        }
    };



  
    //  eliminar registros de mantenimiento
    const eliminarMantenimiento = async (id_mantenimiento) => {
      try {
        const response = await fetch(`${backendUrl}/api/mantenimiento/${id_mantenimiento}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          alert("Mantenimiento eliminado correctamente");
          cargarMantenimiento();
        } else {
          alert(`Error al eliminar: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error al eliminar el mantenimiento:", error);
      }
    };
  
    // actualizar registros de mantenimientos 
    const actualizarMantenimiento = async (id_mantenimiento) => {
      try {
        // Realizar la solicitud para obtener los datos del destino
        const response = await fetch(`${backendUrl}/api/mantenimiento/${id_mantenimiento}`);
        const result = await response.json();
    
        if (response.ok) {
          // Llenar los campos del formulario con los datos obtenidos
          document.getElementById("descripcion").value = result.data.descripcion;
          document.getElementById("id_avion").value = result.data.id_avion;
          
    
          // Cambiar el texto del botón a "Actualizar"
          const submitButton = document.querySelector('button[type="submit"]');
          submitButton.textContent = "Actualizar";
    
          // Cambiar la acción del formulario a "actualizar"
          formulario.onsubmit = async (event) => {
            event.preventDefault();
    
            const descripcion = document.getElementById("descripcion").value;
            const id_avion = document.getElementById("id_avion").value;
            
    
            const mantenimientoData = { descripcion , id_avion };
    
            try {
              // Realizar la solicitud PUT al backend
              const response = await fetch(`${backendUrl}/api/mantenimiento/${id_mantenimiento}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mantenimientoData),
              });
    
              if (response.ok) {
                alert("mantenimiento actualizado correctamente");
    
                // Recargar los destinos para reflejar los cambios
                cargarMantenimiento();
    
                // Restaurar el formulario al estado original
                submitButton.textContent = "Registrar";
                formulario.onsubmit = registrarMantenimiento;
                formulario.reset();
              } else {
                const errorData = await response.json();
                alert(`Error al actualizar: ${errorData.message || response.statusText}`);
              }
            } catch (error) {
              console.error("Error al actualizar el mantenimiento:", error);
              alert("Error al actualizar el mantenimiento");
            }
          };
        } else {
          alert("No se pudo obtener los datos del mantenimiento.");
        }
      } catch (error) {
        console.error("Error al obtener el mantenimiento:", error);
        alert("Error al obtener los datos del mantenimiento.");
      }
    };
    
    
  
    formulario.onsubmit = registrarMantenimiento;
    await cargarAvion();
    await cargarMantenimiento();
  });
  

  