document.addEventListener("DOMContentLoaded", async () => {
    const formulario = document.getElementById("aeropuertoForm");
    const aeropuertoTableBody = document.getElementById("aeropuerto");
    const buscarButton = document.getElementById("buscarAeropuerto");
  
    let backendUrl = "";
    try {
      const configResponse = await fetch("/api/config");
      const config = await configResponse.json();
      backendUrl = `http://localhost:${config.port}`;
    } catch (error) {
      console.error("Error al obtener la configuración del backend:", error);
      alert("No se pudo obtener la configuración del servidor.");
      return;
    }
  
    const cargarAeropuerto = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/aeropuertos`);
        const aeropuertos = await response.json();
        aeropuertoTableBody.innerHTML = "";
  
        aeropuertos.forEach((aeropuerto) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${aeropuerto.id_aeropuerto}</td>
            <td>${aeropuerto.nombre}</td>
            <td>${aeropuerto.ciudad}</td>
            <td>${aeropuerto.pais}</td>
            <td class="d-flex justify-content-center">
              <button class="btn btn-warning btn-sm edit-btn" data-id="${aeropuerto.id_aeropuerto}">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button class="btn btn-danger btn-sm delete-btn" data-id="${aeropuerto.id_aeropuerto}">
                <i class="fas fa-trash-alt"></i> Eliminar
              </button>
            </td>`;
          aeropuertoTableBody.appendChild(tr);
        });
  
        agregarEventos();
      } catch (error) {
        console.error("Error al cargar los aeropuertos:", error);
        alert("No se pudo cargar la información de los aeropuertos.");
      }
    };
    
    // eventos para los botenes que estan disponibles en el formulario
    const agregarEventos = () => {
      const editButtons = document.querySelectorAll(".edit-btn");
      const deleteButtons = document.querySelectorAll(".delete-btn");
  
      editButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const aeropuertoId = button.getAttribute("data-id");
          editarAeropuerto(aeropuertoId);
        });
      });
  
      deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const aeropuertoId = button.getAttribute("data-id");
          eliminarAeropuerto(aeropuertoId);
        });
      });
  
      buscarButton.addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value;
        buscarAeropuerto(nombre);
      });
    };

    // funcion para buscar aeropuertos 
    const buscarAeropuerto = async (nombre) => {
        try {
          const response = await fetch(`${backendUrl}/api/aeropuertos/${nombre}`);
          const result = await response.json();
          console.log("Resultado de la búsqueda:", result);
      
          if (response.ok) {
            aeropuertoTableBody.innerHTML = '';
      
            const aeropuerto = result.data;
      
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${aeropuerto.id_aeropuerto}</td>
              <td>${aeropuerto.nombre}</td>
              <td>${aeropuerto.ciudad}</td>
              <td>${aeropuerto.pais}</td>
              <td class="d-flex justify-content-center">
                <button class="btn btn-warning btn-sm edit-btn" data-id="${aeropuerto.id_aeropuerto}">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${aeropuerto.id_aeropuerto}">
                  <i class="fas fa-trash-alt"></i> Eliminar
                </button>
              </td>
            `;
      
            aeropuertoTableBody.appendChild(tr);
      
            // Reasignar los eventos de los botones después de que se ha agregado la fila
            agregarEventos();
            
            alert(result.mensaje || 'Aeropuerto encontrado correctamente');
          } else {
            alert(`Error: ${result.mensaje || 'Aeropuerto no encontrado'}`);
          }
        } catch (error) {
          console.error('Error al buscar aeropuerto:', error);
          alert('Ocurrió un error al buscar el aeropuerto. Inténtalo nuevamente.');
        }
      };
      
    // funcion para editar aeropuertos 
    const editarAeropuerto = async (id_aeropuerto) => {
      try {
        const response = await fetch(`${backendUrl}/api/aeropuertosID/${id_aeropuerto}`);
        const result = await response.json();
  
        if (response.ok) {
          document.getElementById("nombre").value = result.data.nombre;
          document.getElementById("ciudad").value = result.data.ciudad;
          document.getElementById("pais").value = result.data.pais;
  
          const submitButton = document.querySelector('button[type="submit"]');
          submitButton.textContent = "Actualizar";
  
          formulario.onsubmit = async (event) => {
            event.preventDefault();
  
            const nombre = document.getElementById("nombre").value;
            const ciudad = document.getElementById("ciudad").value;
            const pais = document.getElementById("pais").value;
  
            const aeropuertoData = { nombre, ciudad, pais };
  
            try {
              const response = await fetch(`${backendUrl}/api/aeropuertosID/${id_aeropuerto}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(aeropuertoData),
              });
  
              if (response.ok) {
                alert("Aeropuerto actualizado correctamente");
                cargarAeropuerto();
                submitButton.textContent = "Registrar";
                formulario.onsubmit = registrarAeropuerto;
              } else {
                alert(`Error al actualizar: ${response.statusText}`);
              }
            } catch (error) {
              console.error("Error al actualizar el aeropuerto:", error);
            }
          };
        }
      } catch (error) {
        console.error("Error al obtener los datos del aeropuerto:", error);
      }
    };
    
    // funcion para eliminar aeropuertos 
    const eliminarAeropuerto = async (id_aeropuerto) => {
      try {
        const response = await fetch(`${backendUrl}/api/aeropuertosID/${id_aeropuerto}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          alert("Aeropuerto eliminado correctamente");
          cargarAeropuerto();
        } else {
          alert(`Error al eliminar: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error al eliminar el aeropuerto:", error);
      }
    };
    
    // funcion para registrar aeropuertos 
    const registrarAeropuerto = async (event) => {
      event.preventDefault();
  
      const nombre = document.getElementById("nombre").value;
      const ciudad = document.getElementById("ciudad").value;
      const pais = document.getElementById("pais").value;
  
      const aeropuertoData = { nombre, ciudad, pais };
  
      try {
        const response = await fetch(`${backendUrl}/api/aeropuertos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(aeropuertoData),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert("Aeropuerto registrado correctamente");
          cargarAeropuerto();
          formulario.reset();
        } else if (response.status === 409) {
          alert(result.mensaje || "El aeropuerto ya existe.");
        } else {
          alert(result.mensaje || "Ocurrió un error al registrar el aeropuerto.");
        }
      } catch (error) {
        console.error("Error al registrar aeropuerto:", error);
        alert("No se pudo enviar la solicitud. Inténtalo nuevamente.");
      }
    };
  
    formulario.onsubmit = registrarAeropuerto;
    cargarAeropuerto();
  });
  