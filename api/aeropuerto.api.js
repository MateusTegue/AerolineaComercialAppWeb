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
      console.log("Error al obtener la configuración del backend:", error);
      Swal .fire({
        icon: 'error',
        title: 'Error al obtener la configuración del backend',
        text: 'Por favor, inténtelo de nuevo más tarde',
      });
      return;
    }


    
    // funcion para cargar los registros de los aeropuertos 
    const cargarAeropuerto = async () => {
      try {
        const response = await fetch('/api/aeropuertos');
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
        console.log("Error al cargar los registros:", error);
        Swal .fire({
          icon: 'error',
          title: 'Error al cargar los registros',
          text: 'No se pudo cargar la información de los aeropuertos.',
        })
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
          // const response = await fetch(`${backendUrl}/api/aeropuertos/${nombre}`);
          const response = await fetch(`/api/aeropuertos/${nombre}`);
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
            
            console.log(result.mensaje || 'Aeropuerto encontrado correctamente');
            Swal.fire({
              icon : 'success',
              title : 'Aeropuerto encontrado correctamente',
              text : result.mensaje || 'Aeropuerto encontrado correctamente'

            });
          } else {
            console.log(`Error: ${result.mensaje || 'Aeropuerto no encontrado'}`);
            Swal.fire({
              icon : 'error',
              title : 'Aeropuerto no encontrado',
              text : result.mensaje || 'Aeropuerto no encontrado'
            });
          }
        } catch (error) {
          console.log("Error de sistema", error);
          Swal.fire({
          icon : "error",
          title : "Error de sistema",
          text : "El servidor no puede procesar la solicitud"
          });
      }
      };
      
    // funcion para editar aeropuertos 
    const editarAeropuerto = async (id_aeropuerto) => {
      try {
        const response = await fetch(`/api/aeropuertosID/${id_aeropuerto}`);
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
              const response = await fetch(`/api/aeropuertosID/${id_aeropuerto}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(aeropuertoData),
              });
  
              if (response.ok) {
                console.log("Aeropuerto actualizado correctamente");
                Swal.fire({
                  icon : "success",
                  title : "Aeropuerto actualizado correctamente",
                  text : "El aeropuerto ha sido actualizado correctamente",
                });
                cargarAeropuerto();
                formulario.reset();
                submitButton.textContent = "Registrar";
                formulario.onsubmit = registrarAeropuerto;
              } else {
                console.log(`Error al actualizar: ${response.statusText}`);
                Swal.fire({
                  icon : "error",
                  title : "Error al actualizar",
                  text : "Ha ocurrido un error al actualizar el aeropuerto"
                });
              }
            } catch (error) {
              console.log("Error al actualizar el aeropuerto:", error);
              Swal.fire({
                icon : "error",
                title : "Error al actualizar",
                text : "Ha ocurrido un error al actualizar el aeropuerto"
              })
            }
          };
        }
      } catch (error) {
        console.log("Error de sistema", error);
        Swal.fire({
          icon : "error",
          title : "Error de sistema",
          text : "El servidor no puede procesar la solicitud"
          });
      }
    };
    
    // funcion para eliminar aeropuertos 
    const eliminarAeropuerto = async (id_aeropuerto) => {
      try {
        const response = await fetch(`/api/aeropuertosID/${id_aeropuerto}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          console.log("Aeropuerto eliminado con exito");
          Swal.fire({
            icon: "susccess",
            title: "Aeropuerto eliminado",
            text: "El aeropuerto ha sido eliminado correctamente",
          });
          cargarAeropuerto();
        } else {
          console.log( "Error al eliminar el aeropuerto:", response.statusText);
          Swal.fire({ 
            icon: "error",
            title: "Error al eliminar",
            text: "El aeropuerto no se pudo eliminar",
          });
        
        }
      } catch (error) {
        console.log ("Error al eliminar el aeropuerto:", error);
        Swal.fire({
          icon: "error",
          title: "Error de sistema ",
          text: "El servidor no puede procesar la solicitud",
        })
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
        const response = await fetch(`/api/aeropuertos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(aeropuertoData),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          console.log( "Aeropuerto registrado con exito");
          Swal.fire({ 
            icon: "success",
            title: "Aeropuerto registrado",
            text: "El aeropuerto ha sido registrado correctamente",
            });
            cargarAeropuerto();
          formulario.reset();
        } else if (response.status === 409) {
          alert("El aeropuerto ya existe.");
        } else {
          alert("Ocurrió un error al registrar el aeropuerto.");
        }
      } catch (error) {
        console.error("Error al registrar aeropuerto:", error);
        alert("No se pudo enviar la solicitud. Inténtalo nuevamente.");
      } 
    };

    // 


    formulario.onsubmit = registrarAeropuerto;
    cargarAeropuerto();
    
  });
  