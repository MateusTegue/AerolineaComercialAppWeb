import { ViajeModel } from "../models/viaje.model.js";

// Registrar viajes
export const registrarViaje = async (req, res) => {
  try {
    const { pais_salida, ciudad_salida, id_tiquete, id_avion, id_destino, id_tripulacion } = req.body;
    if (!pais_salida || !ciudad_salida || !id_tiquete || !id_avion || !id_destino || !id_tripulacion) {
      return res.status(400).json({ ok: false, mensaje: "Faltan campos" });
    }
    const nuevoViaje = await ViajeModel.crearViaje(pais_salida, ciudad_salida, id_tiquete, id_avion, id_destino, id_tripulacion);
    return res.status(201).json({ ok: true, mensaje: "Viaje creado con éxito", datos: nuevoViaje });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al crear el viaje", error: error.message });
  }
};

// Mostrar viajes
export const mostrarViajes = async (req, res) => {
  try {
    const viajes = await ViajeModel.mostrarViajes();
    return res.status(200).json(viajes);
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al obtener los viajes" });
  }
};

// Buscar viajes por ID
export const buscarMantenimientoID = async (req, res) => {
  try {
    const { id_viaje } = req.params;
    const viaje = await ViajeModel.buscarViajePorID(id_viaje);
    if (viaje) {
      return res.status(200).json({ ok: true, data: viaje });
    } else {
      return res.status(404).json({ ok: false, mensaje: "viaje no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al buscar el viaje", error: error.message });
  }
};

// Actualizar viaje
export const actualizarViaje = async (req, res) => {
  try {
    const { id_viaje } = req.params;
    const { pais_salida, ciudad_salida, id_tiquete, id_avion, id_destino, id_tripulacion,  } = req.body;

    if (!pais_salida || !ciudad_salida || !id_tiquete || !id_avion || !id_destino || !id_tripulacion) {
      return res.status(400).json({ ok: false, mensaje: "Faltan campos por completar" });
    }

    const viajeActualizado = await ViajeModel.actualizarViaje(
        pais_salida,
        ciudad_salida,
        id_tiquete,
        id_avion,
        id_destino,
        id_tripulacion,
        id_viaje
    );

    if (viajeActualizado) {
      return res.status(200).json({ ok: true, mensaje: "Viaje actualizado con éxito", data: viajeActualizado });
    } else {
      return res.status(404).json({ ok: false, mensaje: "viaje no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar el viaje", error: error.message });
  }
};

// Eliminar viaje
export const eliminarViaje = async (req, res) => {
  try {
    const { id_viaje } = req.params;
    const viajeEliminado = await ViajeModel.borrarViaje(id_viaje);
    if (viajeEliminado) {
      return res.status(200).json({ ok: true, mensaje: "Viaje eliminado con éxito", data: viajeEliminado });
    } else {
      return res.status(404).json({ ok: false, mensaje: "Viaje no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar el Viaje", error: error.message });
  }
};
