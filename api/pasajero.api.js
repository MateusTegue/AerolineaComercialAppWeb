document.addEventListener("DOMContentLoaded", async () => {
    const formulario = document.getElementById("pasajeroForm");
    const pasajerosTableBody = document.getElementById("pasajero");
    let backendUrl = "";
  
    // Configuración del puerto que conecta el frontend con el backend
    try {
        const configResponse = await fetch("/api/config");
        const config = await configResponse.json();
        backendUrl = `http://localhost:${config.port}`;
    } catch (error) {
        console.log("Error al obtener la configuración del backend:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo obtener la configuración del backend",
        });
        return;
    }
  
    // Función para cargar los pasajeros desde la base de datos
    const cargarPasajeros = async () => {
        try {
            const response = await fetch(`/api/pasajeros`);
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
            console.log("Error al cargar los pasajeros:", error);
            Swal.fire({
                icon: "error",
                title: "Error al cargar los registros",
                text: "No se pudo cargar los registros",
            });
        }
    };
  
    // Función para editar un pasajero
    const editarPasajero = async (id_pasajero) => {
        try {
            const response = await fetch(`/api/pasajeros/${id_pasajero}`);
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
                        const response = await fetch(`/api/pasajeros/${id_pasajero}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(pasajeroData),
                        });
  
                        if (response.ok) {
                            Swal.fire({
                                icon: "success",
                                title: "Actualizado con éxito",
                                text: "Los datos del pasajero han sido actualizados con éxito",
                            });
                            cargarPasajeros();
                            formulario.reset();
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Error al actualizar",
                                text: "Ha ocurrido un error al actualizar los datos del pasajero",
                            });
                        }
                    } catch (error) {
                        Swal.fire({
                            icon: "error",
                            title: "Error al actualizar",
                            text: "Ha ocurrido un error al actualizar los datos del pasajero",
                        });
                    }
                };
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error al obtener la información",
                    text: "Ha ocurrido un error al obtener la información del pasajero",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error del sistema",
                text: "El servidor no puede procesar la solicitud",
            });
        }
    };
  
    // Función para eliminar un pasajero
    const eliminarPasajero = async (id_pasajero) => {
        try {
            const response = await fetch(`/api/pasajeros/${id_pasajero}`, {
                method: "DELETE",
            });
  
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Eliminado con éxito",
                    text: "El pasajero ha sido eliminado correctamente",
                });
                cargarPasajeros();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error al eliminar",
                    text: "Ha ocurrido un error al eliminar al pasajero",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error del sistema",
                text: "No se pudo procesar la solicitud de eliminación",
            });
        }
    };
  
    // Función para registrar un pasajero
    const registrarPasajeros = async (event) => {
        event.preventDefault();
  
        const numerocedula = document.getElementById("numerocedula").value;
        const primernombre = document.getElementById("primernombre").value;
        const segundonombre = document.getElementById("segundonombre").value;
        const primerapellido = document.getElementById("primerapellido").value;
        const segundoapellido = document.getElementById("segundoapellido").value;
        const numerotelefono = document.getElementById("numerotelefono").value;
        const correo = document.getElementById("correo").value;
  
        const datosPasajeros = { numerocedula, primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo };
  
        try {
            const response = await fetch("/api/pasajeros", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosPasajeros),
            });
  
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Registrado con éxito",
                    text: "El pasajero ha sido registrado correctamente",
                });
                cargarPasajeros();
                formulario.reset();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error al registrar",
                    text: "Ha ocurrido un error al registrar al pasajero",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error del sistema",
                text: "No se pudo procesar la solicitud de registro",
            });
        }
    };
  
    // Agregar eventos a los botones de editar y eliminar
    function agregarEventos() {
        const editButtons = document.querySelectorAll(".edit-btn");
        const deleteButtons = document.querySelectorAll(".delete-btn");
  
        editButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                const id_pasajero = button.getAttribute("data-id");
                editarPasajero(id_pasajero);
            });
        });
  
        deleteButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                const id_pasajero = button.getAttribute("data-id");
                eliminarPasajero(id_pasajero);
            });
        });
    }
  
    // Inicializar la carga de pasajeros
    cargarPasajeros();
  
    // Registrar un pasajero nuevo
    formulario.addEventListener("submit", registrarPasajeros);
  });
  




