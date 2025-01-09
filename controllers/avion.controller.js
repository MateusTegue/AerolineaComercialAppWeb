import { AvionModel } from "../models/avion.model.js";

// Registrar destino
export const registrarAvion = async (req, res) => {
  try {
    const { id_avion, referencia, nombre, modelo, capacidad, id_tripulacion } = req.body;
    if (!id_avion || !referencia || !nombre || !modelo || !capacidad || !id_tripulacion) {
      return res.status(400).json({ ok: false, mensaje: "Faltan campos" });
    }
    const nuevoAvion = await AvionModel.crearAvion(id_avion, referencia , nombre, modelo, capacidad, id_tripulacion);
    return res.status(201).json({ ok: true, mensaje: "Avion creado con éxito", datos: nuevoAvion });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al crear el avion", error: error.message });
  }
};

// Mostrar destinos
export const mostrarAvion = async (req, res) => {
  try {
    const aviones = await AvionModel.mostrarAvion();
    return res.status(200).json(aviones);
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al obtener los aviones" });
  }
};

// Buscar destino por ID
export const buscarAvionID = async (req, res) => {
  try {
    const { id_avion } = req.params;
    const avion = await AvionModel.buscarAvionID(id_avion);
    if (avion) {
      return res.status(200).json({ ok: true, data: avion });
    } else {
      return res.status(404).json({ ok: false, mensaje: "Avion no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al buscar el avion", error: error.message });
  }
};

// Actualizar destino
export const actualizarAvion = async (req, res) => {
    try {
      const { id_avion } = req.params; // Asegúrate de que este valor venga de la ruta
      const { referencia, nombre, modelo, capacidad, id_tripulacion } = req.body;
  
      if (!referencia || !nombre || !modelo || !capacidad || !id_tripulacion) {
        return res.status(400).json({ ok: false, mensaje: "Faltan campos por completar" });
      }
  
      // Pasa id_avion como último argumento
      const avionActualizado = await AvionModel.actualizarAvion(
        referencia, 
        nombre, 
        modelo, 
        capacidad, 
        id_tripulacion, 
        id_avion
      );
  
      if (avionActualizado) {
        return res.status(200).json({ ok: true, mensaje: "Avión actualizado con éxito", data: avionActualizado });
      } else {
        return res.status(404).json({ ok: false, mensaje: "Avión no encontrado" });
      }
    } catch (error) {
      return res.status(500).json({ ok: false, mensaje: "Error al actualizar el avión", error: error.message });
    }
  };
  
// Eliminar destino
export const borrarAvion = async (req, res) => {
  try {
    const { id_avion } = req.params;
    const avionEliminado = await AvionModel.borrarAvion(id_avion);
    if (avionEliminado) {
      return res.status(200).json({ ok: true, mensaje: "Avion eliminado con éxito" });
    } else {
      return res.status(404).json({ ok: false, mensaje: "Avion no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar el avion", error: error.message });
  }
};
