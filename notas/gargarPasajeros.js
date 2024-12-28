const cargarPasajeros = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/pasajeros`);
      const pasajeros = await response.json();
      
      // Limitar a los primeros 6 pasajeros
      const primeros6Pasajeros = pasajeros.slice(0, 6);
  
      pasajerosTableBody.innerHTML = "";
  
      primeros6Pasajeros.forEach((pasajero) => {
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
  