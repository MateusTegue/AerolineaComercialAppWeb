import { database } from '../database/conexion.js'; // Asegúrate de importar database
import { AeropuertoModel } from '../models/aeropuerto.model.js';

export const registrarAeropuerto = async (req, res) => {
    try {
        const { nombre, ciudad, pais } = req.body;

        // Validar que todos los campos estén completos
        if (!nombre || !ciudad || !pais) {
            return res.status(400).json({ ok: false, mensaje: "Faltan campos por completar" });
        }

        // Verificar si el aeropuerto ya existe usando mostrarAeropuertoNombre
        const aeropuertoExistente = await database.query(
            `SELECT * FROM aeropuerto WHERE nombre = $1`,
            [nombre]
        );
        if (aeropuertoExistente.rows.length > 0) {
            return res.status(400).json({ ok: false, mensaje: "El aeropuerto ya existe" });
        }

        // Guardar el aeropuerto en la base de datos usando crearAeropuetos
        const nuevoAeropuerto = await AeropuertoModel.crearAeropuetos(nombre, ciudad, pais);

        // Respuesta exitosa
        return res.status(201).json({ ok: true, mensaje: "Aeropuerto registrado correctamente", data: nuevoAeropuerto });
    } catch (error) {
        // Manejo de errores
        return res.status(500).json({ ok: false, mensaje: "Error al registrar el aeropuerto", error: error.message });
    }
};

// mostrar todos los aeropuestos registrados 
// aeropuerto.controller.js
export const mostrarAeropuertos = async (req, res) => {
    try {
        const result = await database.query("SELECT * FROM aeropuerto");
        res.json(result.rows); // Devuelve los aeropuertos como un JSON
    } catch (error) {
        console.error('Error al obtener los aeropuertos:', error);
        res.status(500).json({ mensaje: 'Error al obtener los aeropuertos.' });
    }
};










//debemos acomodar esta consulta para que se ejecute en la base de datos
// buscar aeropuerto pos nombre 
export const buscarAeropuertoPorNombre = async (req, res) => {
    try {
        const { nombre } = req.params;
        const aeropuerto = await database.query( `SELECT * FROM aeropuerto WHERE nombre = $1`, [nombre]);
        if (aeropuerto.rows.length > 0) {
            return res.status(200).json({ ok: true, mensaje: "Aeropuerto encontrado ", data: aeropuerto.rows[0] });
        } else {
                return res.status(404).json({ ok: false, mensaje: "Aeropuerto no encontrado " });
         }
            } catch (error) {
                    return res.status(500).json({ ok: false, mensaje: "Error al buscar el aeropuerto", error: error.message });
            }
};


