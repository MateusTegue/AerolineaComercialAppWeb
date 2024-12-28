import { DestinoModel } from "../models/destino.model.js";

// Registrar destino
export const registrarDestino = async (req, res) => {
  try {
    const { pais_llegada, ciudad_llegada, id_aeropuerto } = req.body;
    if (!pais_llegada || !ciudad_llegada || !id_aeropuerto) {
      return res.status(400).json({ ok: false, mensaje: "Faltan campos" });
    }
    const nuevoDestino = await DestinoModel.crearDestino(pais_llegada, ciudad_llegada, id_aeropuerto);
    return res.status(201).json({ ok: true, mensaje: "Destino creado con éxito", datos: nuevoDestino });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al crear destino", error: error.message });
  }
};

// Mostrar destinos
export const mostrarDestinos = async (req, res) => {
  try {
    const destinos = await DestinoModel.mostrarDestinosDB();
    return res.status(200).json(destinos);
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al obtener destinos" });
  }
};

// Buscar destino por ID
export const buscarDestino = async (req, res) => {
  try {
    const { id } = req.params;
    const destino = await DestinoModel.buscarDestinoPorID(id);
    if (destino) {
      return res.status(200).json({ ok: true, data: destino });
    } else {
      return res.status(404).json({ ok: false, mensaje: "Destino no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al buscar destino", error: error.message });
  }
};

// Actualizar destino
export const actualizarDestino = async (req, res) => {
  try {
    const { id } = req.params;
    const { pais_llegada, ciudad_llegada, id_aeropuerto } = req.body;

    if (!pais_llegada || !ciudad_llegada || !id_aeropuerto) {
      return res.status(400).json({ ok: false, mensaje: "Faltan campos por completar" });
    }

    if (isNaN(id_aeropuerto)) {
      return res.status(400).json({ ok: false, mensaje: "El id_aeropuerto debe ser un número entero" });
    }

    const destinoActualizado = await DestinoModel.actualizarDestinoDB(pais_llegada, ciudad_llegada, parseInt(id_aeropuerto), id);
    if (destinoActualizado) {
      return res.status(200).json({ ok: true, mensaje: "Destino actualizado con éxito", data: destinoActualizado });
    } else {
      return res.status(404).json({ ok: false, mensaje: "Destino no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar destino", error: error.message });
  }
};

// Eliminar destino
export const borrarDestino = async (req, res) => {
  try {
    const { id } = req.params;
    const destinoEliminado = await DestinoModel.borrarDestinoDB(id);
    if (destinoEliminado) {
      return res.status(200).json({ ok: true, mensaje: "Destino eliminado con éxito" });
    } else {
      return res.status(404).json({ ok: false, mensaje: "Destino no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar destino", error: error.message });
  }
};
