import { MantenimientoModel } from "../models/mantenimiento.model.js";

// Registrar mantenimiento
export const registrarMantenimiento = async (req, res) => {
  try {
    const { descripcion, id_avion } = req.body;
    if (!descripcion || !id_avion) {
      return res.status(400).json({ ok: false, mensaje: "Faltan campos" });
    }
    const nuevoMantenimiento = await MantenimientoModel.crearMantenimiento(descripcion, id_avion);
    return res.status(201).json({ ok: true, mensaje: "Mantenimiento creado con éxito", datos: nuevoMantenimiento });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al crear el mantenimiento", error: error.message });
  }
};

// Mostrar mantenimiento
export const mostrarMantenimiento = async (req, res) => {
  try {
    const mantenimientos = await MantenimientoModel.mostrarMantenimiento();
    return res.status(200).json(mantenimientos);
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al obtener los mantenimientos" });
  }
};

// Buscar mantenimiento por ID
export const buscarMantenimientoID = async (req, res) => {
  try {
    const { id_mantenimiento } = req.params;
    const mantenimiento = await MantenimientoModel.buscarMantenimientoID(id_mantenimiento);
    if (mantenimiento) {
      return res.status(200).json({ ok: true, data: mantenimiento });
    } else {
      return res.status(404).json({ ok: false, mensaje: "Mantenimiento no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al buscar el mantenimiento", error: error.message });
  }
};

// Actualizar mantenimiento
export const actualizarMantenimiento = async (req, res) => {
  try {
    const { id_mantenimiento } = req.params;
    const { descripcion, id_avion } = req.body;

    if (!descripcion || !id_avion) {
      return res.status(400).json({ ok: false, mensaje: "Faltan campos por completar" });
    }

    const mantenimientoActualizado = await MantenimientoModel.actualizarMantenimiento(
      descripcion,
      id_avion,
      id_mantenimiento
    );

    if (mantenimientoActualizado) {
      return res.status(200).json({ ok: true, mensaje: "Mantenimiento actualizado con éxito", data: mantenimientoActualizado });
    } else {
      return res.status(404).json({ ok: false, mensaje: "Mantenimiento no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar el mantenimiento", error: error.message });
  }
};

// Eliminar mantenimiento
export const eliminarMantenimiento = async (req, res) => {
  try {
    const { id_mantenimiento } = req.params;
    const mantenimientoEliminado = await MantenimientoModel.borrarMantenimiento(id_mantenimiento);
    if (mantenimientoEliminado) {
      return res.status(200).json({ ok: true, mensaje: "Mantenimiento eliminado con éxito", data: mantenimientoEliminado });
    } else {
      return res.status(404).json({ ok: false, mensaje: "Mantenimiento no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar el mantenimiento", error: error.message });
  }
};
