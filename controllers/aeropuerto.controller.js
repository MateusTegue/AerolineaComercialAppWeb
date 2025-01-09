import { AeropuertoModel } from "../models/aeropuerto.model.js";

// Registrar un aeropuerto
export const registrarAeropuerto = async (req, res) => {
  try {
    const { nombre, ciudad, pais } = req.body;

    if (!nombre || !ciudad || !pais) {
      return res
        .status(400)
        .json({ ok: false, mensaje: "Faltan campos por completar" });
    }

    // Verificar si el aeropuerto ya existe
    const aeropuertoExistente = await AeropuertoModel.buscarAeropuertoPorNombre(
      nombre
    );
    if (aeropuertoExistente) {
      return res
        .status(400)
        .json({ ok: false, mensaje: "El aeropuerto ya existe" });
    }

    // Registrar el aeropuerto
    const nuevoAeropuerto = await AeropuertoModel.crearAeropuetos(
      nombre,
      ciudad,
      pais
    );
    return res.status(201).json({ok: true,mensaje: "Aeropuerto registrado correctamente",data: nuevoAeropuerto,
      });
  } catch (error) {
    console.error("Error al registrar aeropuerto:", error);
    return res
      .status(500)
      .json({
        ok: false,
        mensaje: "Error al registrar el aeropuerto",
        error: error.message,
      });
  }
};

// Mostrar todos los aeropuertos
export const mostrarAeropuertos = async (req, res) => {
  try {
    const aeropuertos = await AeropuertoModel.mostrarAeropuertos();
    return res.status(200).json(aeropuertos);
  } catch (error) {
    console.error("Error al mostrar aeropuertos:", error);
    return res
      .status(500)
      .json({
        ok: false,
        mensaje: "Error al mostrar los aeropuertos",
        error: error.message,
      });
  }
};

// Buscar un aeropuerto por nombre
export const buscarAeropuertoPorNombre = async (req, res) => {
  try {
    const { nombre } = req.params; // Asegúrate de que el parámetro sea correcto
    console.log("Nombre recibido:", nombre); // Para depurar

    if (!nombre) {
      return res
        .status(400)
        .json({
          ok: false,
          mensaje: "El nombre del aeropuerto es obligatorio",
        });
    }

    const aeropuerto = await AeropuertoModel.buscarAeropuertoPorNombre(nombre);
    if (aeropuerto) {
      return res.status(200).json({ ok: true, data: aeropuerto });
    } else {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Aeropuerto no encontrado" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({
        ok: false,
        mensaje: "Error en el servidor",
        error: error.message,
      });
  }
};

// Obtener un aeropuerto por ID
export const obtenerAeropuertoPorId = async (req, res) => {
  try {
    const { id } = req.params; // Cambiar id_aeropuerto a id
    const aeropuerto = await AeropuertoModel.obtenerAeropuertoPorId(id);

    if (aeropuerto) {
      return res.status(200).json({ ok: true, data: aeropuerto });
    } else {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Aeropuerto no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener aeropuerto:", error);
    return res
      .status(500)
      .json({
        ok: false,
        mensaje: "Error al obtener el aeropuerto",
        error: error.message,
      });
  }
};

export const actualizarAeropuerto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ciudad, pais } = req.body;

    if (!nombre || !ciudad || !pais) {
      return res
        .status(400)
        .json({ ok: false, mensaje: "Faltan campos por completar" });
    }

    // Llamada al modelo para actualizar el aeropuerto
    const aeropuertoActualizado = await AeropuertoModel.actualizarAeropuertoDB(
      id,
      nombre,
      ciudad,
      pais
    );

    if (aeropuertoActualizado) {
      return res.status(200).json({
        ok: true,
        mensaje: "Aeropuerto actualizado correctamente",
        data: aeropuertoActualizado,
      });
    } else {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Aeropuerto no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar aeropuerto:", error);
    return res
      .status(500)
      .json({
        ok: false,
        mensaje: "Error al actualizar el aeropuerto",
        error: error.message,
      });
  }
};

// eliminar aeropuertos
export const eliminarAeropuerto = async (req, res) => {
  try {
    const { id } = req.params;
    const aeropuertoEliminado = await AeropuertoModel.eliminarAeropuertosDB(id);
    if (aeropuertoEliminado) {
      return res
        .status(200)
        .json({ ok: true, mensaje: "Aeropuerto eliminado correctamente" });
    } else {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Aerop uerto no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar aeropuerto:", error);
    return res
      .status(500)
      .json({
        ok: false,
        mensaje: "Error al eliminar el aeropuerto",
        error: error.message,
      });
  }
};
