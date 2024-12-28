import { PasajeroModel } from "../models/pasajero.model.js";

// Registrar pasajeros
export const registrarPasajero = async (req, res) => {
  try {
      const {
          numerocedula,
          primernombre,
          segundonombre,
          primerapellido,
          segundoapellido,
          numerotelefono,
          correo,
      } = req.body;

      // Validación de campos obligatorios
      if (!numerocedula || !primernombre || !primerapellido || !correo) {
          return res.status(400).json({ message: "Faltan campos obligatorios" });
      }

      // Verificar si el pasajero ya existe
      const pasajeroExistente = await PasajeroModel.obtenerPasajeroPorCedula(numerocedula);

      if (pasajeroExistente) {
          return res.status(409).json({
              ok: false,
              message: "El pasajero ya está registrado con esta cédula.",
          });
      }

      // Crear nuevo pasajero
      const pasajeroNuevo = await PasajeroModel.crearPasajero(
          numerocedula,
          primernombre,
          segundonombre,
          primerapellido,
          segundoapellido,
          numerotelefono,
          correo
      );

      return res.status(201).json({
          ok: true,
          message: "Pasajero registrado correctamente",
          data: pasajeroNuevo,
      });
  } catch (error) {
      console.error("Error al registrar el pasajero", error);
      return res.status(500).json({
          ok: false,
          message: "Error al registrar el pasajero",
      });
  }
};


// Mostrar pasajeros
export const mostrarPasajeros = async (req, res) => {
    try {
        const pasajeros = await PasajeroModel.mostrarPasajeros();
        return res.status(200).json(pasajeros);
    } catch (error) {
        console.error("Error al mostrar los pasajeros", error);
        return res.status(500).json({
            ok: false,
            message: "Error al mostrar los pasajeros",
            error: error.message,
        });
    }
};

export const obtenerPasajeroPorId = async (req, res) => {
    try {
      const { id } = req.params; // Se obtiene el ID de los parámetros de la ruta
  
      if (!id) {
        return res.status(400).json({ message: "ID del pasajero es obligatorio" });
      }
  
      const pasajero = await PasajeroModel.obtenerPasajeroPorId(id);
  
      if (!pasajero) {
        return res.status(404).json({ ok: false, message: "Pasajero no encontrado" });
      }
  
      return res.status(200).json({
        ok: true,
        data: pasajero,
      });
    } catch (error) {
      console.error("Error al obtener el pasajero por ID:", error);
      return res.status(500).json({ ok: false, message: "Error al obtener el pasajero" });
    }
  };
  




// Actualizar pasajero
export const actualizarPasajero = async (req, res) => {
    try {
      const { id } = req.params; // Aquí usamos el ID del pasajero que se recibe en los parámetros de la ruta
      const { primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo } = req.body;
  
      // Validar que todos los campos necesarios están presentes
      if (!id || !primernombre || !primerapellido || !correo) {
        return res.status(400).json({ message: "Faltan campos obligatorios o ID" });
      }
  
      const pasajeroActualizado = await PasajeroModel.actualizarPasajero(
        id,
        primernombre,
        segundonombre,
        primerapellido,
        segundoapellido,
        numerotelefono,
        correo
      );
  
      if (!pasajeroActualizado) {
        return res.status(404).json({ ok: false, message: "Pasajero no encontrado" });
      }
  
      return res.status(200).json({
        ok: true,
        message: "Pasajero actualizado correctamente",
        data: pasajeroActualizado,
      });
    } catch (error) {
      console.error("Error al actualizar el pasajero:", error);
      return res.status(500).json({ ok: false, message: "Error al actualizar el pasajero" });
    }
  };
  
  
// Eliminar pasajero
export const eliminarPasajero = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID es obligatorio" });
        }

        const pasajeroEliminado = await PasajeroModel.eliminarPasajero(id);
        return res.status(200).json({
            ok: true,
            message: "Pasajero eliminado correctamente",
            data: pasajeroEliminado,
        });
    } catch (error) {
        console.error("Error al eliminar el pasajero", error);
        return res.status(500).json({ ok: false, message: "Error al eliminar el pasajero" });
    }
};
