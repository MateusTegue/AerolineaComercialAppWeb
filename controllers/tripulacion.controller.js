import { TripulacionModel } from "../models/tripulacion.model.js";

// Registrar tripulacion
export const registrarTripulacion = async (req, res) => {
  try {
    const { codigo , numerocedula } = req.body;
    if (!codigo || !numerocedula) {
      return res.status(400).json({ ok: false, mensaje: "Faltan campos" });
    }
    const nuevaTripulacion = await TripulacionModel.crearTripulacion(codigo, numerocedula);
    return res.status(201).json({ ok: true, mensaje: "tripulacion creada con éxito", datos: nuevaTripulacion });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al crear la tripulacion", error: error.message });
  }
};

// Mostrar tripulacion
export const mostrarTripulacion = async (req, res) => {
  try {
    const tripulaciones = await TripulacionModel.mostrarTripulacion();
    return res.status(200).json(tripulaciones);
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al obtener la tripulaciones" });
  }
};

// Buscar tripulacion por ID
export const buscarTripulacion = async (req, res) => {
  try {
    const { id_tripulacion } = req.params;
    const tripulacion = await TripulacionModel.mostrarTripulacionPorID(id_tripulacion);
    if (tripulacion) {
      return res.status(200).json({ ok: true, data: tripulacion });
    } else {
      return res.status(404).json({ ok: false, mensaje: "Tripulacion no encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al buscar la tripulacion", error: error.message });
  }
};

// Actualizar destino
export const actualizarTripulacion = async (req, res) => {
  try {
    const { id_tripulacion } = req.params;
    const { codigo , numerocedula } = req.body;

    if (!codigo || !numerocedula ) {
      return res.status(400).json({ ok: false, mensaje: "Faltan campos por completar" });
    }


    const tripulacionActualizada = await TripulacionModel.actualizarTripulacion(codigo, numerocedula, id_tripulacion);
    if (tripulacionActualizada) {
      return res.status(200).json({ ok: true, mensaje: "Tripulacion actualizada con éxito", data: tripulacionActualizada });
    } else {
      return res.status(404).json({ ok: false, mensaje: "Tripulacion no encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar la tripulacion", error: error.message });
  }
};

// Eliminar destino
export const borrarTripulacion = async (req, res) => {
  try {
    const { id_tripulacion } = req.params;
    const tripulacionEliminada = await TripulacionModel.borrarTripulacion(id_tripulacion);
    if (tripulacionEliminada) {
      return res.status(200).json({ ok: true, mensaje: "Tripulacion eliminada con éxito" });
    } else {
      return res.status(404).json({ ok: false, mensaje: "Tripulacion no encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar la tripulacion", error: error.message });
  }
};
