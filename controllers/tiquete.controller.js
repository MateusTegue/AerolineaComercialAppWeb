import { tr } from "date-fns/locale";
import { TiqueteModel } from "../models/tiquete.model.js";
import { addWeeks, format } from 'date-fns';

export const resgistrarTiquete = async (req, res) => {
    try {
        console.log(req.body); // Verifica los datos recibidos
        const { fecha, id_pasajero } = req.body;

        if (!fecha || !id_pasajero) {
            return res.status(400).json({ msg: "Faltan datos" });
        }

        const nuevoTiquete = await TiqueteModel.crearTiqueteDB(fecha, id_pasajero);

        nuevoTiquete.fecha = format(new Date(nuevoTiquete.fecha), 'dd-MM-yyyy');
        return res.status(201).json({ ok: true, mensaje: "Tiquete creado con éxito", datos: nuevoTiquete });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al registrar tiquete" });
    }
};
// mostrar tiquetes

export const mostrarTiquetes = async (req, res) => {
    try {
        const tiquetes = await TiqueteModel.mostrarTiquetesDB();

        // Formatear las fechas
        const tiquetesFormateados = tiquetes.map((tiquete) => ({
            ...tiquete,
            fecha: format(new Date(tiquete.fecha), "dd-MM-yyyy"), // Formato deseado
        }));

        return res.status(200).json(tiquetesFormateados);
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al mostrar tiquetes" });
    }
};


// mostrar por id 
export const mostrarTiqueteId = async (req, res) => {
    try {
        const { id_tiquete } = req.params;
        const tiquete = await TiqueteModel.mostrarPoridDB(id_tiquete);

        // Verificar si el tiquete existe
        if (tiquete) {
            // Formatear la fecha
            tiquete.fecha = format(new Date(tiquete.fecha), "dd-MM-yyyy");

            return res.status(200).json({ ok: true, data: tiquete });
        } else {
            return res.status(404).json({ ok: false, mensaje: "Tiquete no encontrado" });
        }

    } catch (error) {
        console.error("Error al obtener el tiquete", error);
        return res.status(500).json({ ok: false, mensaje: "Error al mostrar tiquete", error: error.message });
    }
};

// actualizar tiquete 
export const actualizarTiquete = async (req, res) => {
    try {
        const { id_tiquete } = req.params;
        const { fecha, id_pasajero } = req.body; // Cambiar numerocedula por id_pasajero

        console.log("Fecha:", fecha); // Depuración
        console.log("ID del pasajero:", id_pasajero); // Depuración

        if (!fecha || !id_pasajero) {  // Validar id_pasajero
            return res.status(400).json({ mensaje: "Faltan campos" });
        }

        // Buscar al pasajero por el ID
        const pasajero = await PasajeroModel.obtenerPorId(id_pasajero);  // Cambiar de obtenerPorCedula a obtenerPorId

        if (!pasajero) {
            return res.status(404).json({ mensaje: "Pasajero no encontrado con ese ID" });
        }

        const resultado = await TiqueteModel.actualizarTiquete(fecha, id_pasajero, id_tiquete);

        return res.status(200).json({
            mensaje: "Tiquete y pasajero actualizados con éxito",
            data: resultado,
        });
    } catch (error) {
        console.error("Error al actualizar el tiquete", error);
        return res.status(500).json({ mensaje: "Error al actualizar el tiquete" });
    }
};














// borrar tiquete 
export const borrarTiquete = async (req , res ) => {
    try {
        const { id_tiquete } = req.params;
        const tiqueteEliminado = await TiqueteModel.eliminarTiqueteDB(id_tiquete);
        if (tiqueteEliminado) {
            return res.status(200).json({ mensaje: "Tiquete eliminado con éxito" });
        } else {
            return res.status(404).json({ mensaje: "Tiquete no encontrado" });
        }
    } catch (error){
        return res.status(500).json({ mensaje: "Error al borrar tiquete", error})
    }
}






