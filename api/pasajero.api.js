document.addEventListener("DOMContentLoaded", async () => {
    const formulario = document.getElementById("pasajeroForm");
    const pasajerosTableBody = document.getElementById("pasajero");
    // const buscarButton = document.getElementById("buscarAeropuerto");
  
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
  
    const cargarPasajeros = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/pasajeros`);
        const pasajeros = await response.json();
        pasajerosTableBody.innerHTML = "";
  
        pasajeros.forEach((pasajero) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${pasajero.id_pasajero}</td>
            <td>${pasajero.numerocedula}</td>
            <td>${pasajero.primernombre}</td>
            <td>${pasajero.segundonombre}</td>
            <td>${pasajero.primerapellido}</td>
            <td>${pasajero.segundoapellido}</td>
            <td>${pasajero.numerotelefono}</td>
            <td>${pasajero.correo}</td>
            <td class="d-flex justify-content-center">
              <button class="btn btn-warning btn-sm edit-btn" data-id="${pasajero.id_pasajero}">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button class="btn btn-danger btn-sm delete-btn" data-id="${pasajero.id_pasajero}">
                <i class="fas fa-trash-alt"></i> Eliminar
              </button>
            </td>`;
          pasajerosTableBody.appendChild(tr);
        });
  
        agregarEventos();
      } catch (error) {
        console.error("Error al cargar los pasajeros:", error);
      }
    };

    const editarPasajero = async (id_pasajero) => {
        try {
          const response = await fetch(`${backendUrl}/api/pasajeros/${id_pasajero}`);
          const result = await response.json();
      
          if (response.ok) {
            // Rellenar el formulario con los datos del pasajero
            document.getElementById("numerocedula").value = result.data.numerocedula;
            document.getElementById("primernombre").value = result.data.primernombre;
            document.getElementById("segundonombre").value = result.data.segundonombre;
            document.getElementById("primerapellido").value = result.data.primerapellido;
            document.getElementById("segundoapellido").value = result.data.segundoapellido;
            document.getElementById("numerotelefono").value = result.data.numerotelefono;
            document.getElementById("correo").value = result.data.correo;
      
            const submitButton = document.querySelector('button[type="submit"]');
            submitButton.textContent = "Actualizar";
      
            // Actualizar el comportamiento del formulario
            formulario.onsubmit = async (event) => {
              event.preventDefault();
      
              const numerocedula = document.getElementById("numerocedula").value;
              const primernombre = document.getElementById("primernombre").value;
              const segundonombre = document.getElementById("segundonombre").value;
              const primerapellido = document.getElementById("primerapellido").value;
              const segundoapellido = document.getElementById("segundoapellido").value;
              const numerotelefono = document.getElementById("numerotelefono").value;
              const correo = document.getElementById("correo").value;
      
              const pasajeroData = { numerocedula, primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo };
      
              try {
                const response = await fetch(`${backendUrl}/api/pasajeros/${id_pasajero}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(pasajeroData),
                });
      
                if (response.ok) {
                  alert("Pasajero actualizado con éxito");
                  cargarPasajeros();
                  resetFormulario();
                } else {
                  alert(`Error al actualizar pasajero: ${response.statusText}`);
                }
              } catch (error) {
                alert("Error al actualizar la información del pasajero.");
              }
            };
          } else {
            alert("No se pudo obtener la información del pasajero.");
          }
        } catch (error) {
          console.error("Error al editar pasajero:", error);
        }
      };
      
      // Función para restablecer el formulario al estado inicial
      const resetFormulario = () => {
        document.getElementById("pasajeroForm").reset();
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.textContent = "Guardar";
        formulario.onsubmit = registrarPasajeros;
      };
      

      







        // eventos para los botenes que estan disponibles en el formulario
        const agregarEventos = () => {
            const editButtons = document.querySelectorAll(".edit-btn");
            const deleteButtons = document.querySelectorAll(".delete-btn");
        
            editButtons.forEach((button) => {
              button.addEventListener("click", () => {
                const pasajeroid = button.getAttribute("data-id");
                editarPasajero(pasajeroid);
              });
            });
        
            deleteButtons.forEach((button) => {
              button.addEventListener("click", () => {
                const pasajeroid = button.getAttribute("data-id");
                eliminarPasajero(pasajeroid);
              });
            });
        
            buscarButton.addEventListener("click", () => {
              const nombre = document.getElementById("nombre").value;
              buscarAeropuerto(nombre);
            });
          };


        // eliminar pasajeros 
        const eliminarPasajero = async (id_pasajero) => {
            try {
               const response = await fetch(`${backendUrl}/api/pasajeros/${id_pasajero}`, {
                method: "DELETE",
               });
               if (response.ok) {
                alert("Pasajero eliminado correctamente")
                cargarPasajeros();
               } else {
                    alert(`Error al eliminar: ${response.statusText}`);
               }
        } catch (error) {
            console.error("Error al eliminar el pasajero: ", error);
        }
    };


    // registrar pasajeros 
    const registrarPasajeros = async (event) => {
        event.preventDefault();

        const numerocedula = document.getElementById("numerocedula").value;
        const primernombre = document.getElementById("primernombre").value;
        const segundonombre = document.getElementById("segundonombre").value;
        const primerapellido = document.getElementById("primerapellido").value;
        const segundoapellido = document.getElementById("segundoapellido").value;
        const numerotelefono = document.getElementById("numerotelefono").value;
        const correo = document.getElementById("correo").value;

        // datos del pasajero
        const datosPasajeros = { numerocedula, primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo };

        try {
            const response = await fetch(`${backendUrl}/api/pasajeros`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(datosPasajeros),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Pasajero registrado con éxito.");
                cargarPasajeros();
                formulario.reset();
            } else if (response.status === 409) {
                alert(result.mensaje ||" El pasajero ya existe.");

            } else {
                alert( result.mensaje || "Error al registrar el pasajero.");
            }




        } catch (error) {
            console.error("Error al registrar el pasajero:", error)
            alert("No se pudo enviar la solicitud. Intentelo nuevamente ")
        }
    }


    // actualizar impormacion de los pasajeros
    

    formulario.onsubmit = registrarPasajeros;
    cargarPasajeros();
})







