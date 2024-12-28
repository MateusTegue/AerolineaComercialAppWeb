import { tr } from "date-fns/locale";
import { EmpleadoModel } from "../models/empleado.model.js";

// Registrar empleado
export const registrarEmpleado = async (req, res) => {
    try {
        // Verifica los datos que recibes
        console.log("Datos recibidos del cliente:", req.body);

        const { numerocedula, primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo, cargo } = req.body;

        if (!numerocedula || !primernombre || !primerapellido || !numerotelefono || !correo || !cargo) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        // Verificar si el empleado existe
        const empleadoExiste = await EmpleadoModel.obtenerEmpleadoCedula(numerocedula);
        if (empleadoExiste) {
            return res.status(409).json({ message: "El empleado ya existe" });
        }

        // Crear nuevo empleado
        const empleadoNuevo = await EmpleadoModel.crearEmpledo(numerocedula, primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo, cargo);
        return res.status(201).json({
            ok: true,
            message: "Empleado registrado correctamente",
            data: empleadoNuevo,
        });
    } catch (error) {
        console.error("Error al registrar empleado:", error);
        return res.status(500).json({ ok: false, message: "Error al registrar el empleado" });
    }
};

// mostrar empleados registrados 
export const mostrarEmpleados = async (req , res) => {
    try {
        const empleados =  await EmpleadoModel.mostrarEmpleados();
        return res.status(200).json(empleados);
    } catch (error){
        return res.status(500).json({ok: false, message: "Error al obtener los empleados"});
    }
};

// obtener empleados por cedula 
export const obtenerPasajeroPorcedula = async (req, res) => {
    try {
        const {numerocedula} = req.params;
        

        if(!numerocedula) {
            return res.status(400).json({message: "El numero de cedula es obligatorio"})
        }
        const empleado = await EmpleadoModel.obtenerEmpleadoCedula(numerocedula);


        return res.status(200).json({ok: true, data: empleado, })

    } catch (error){
        console.error("Error al obtener el empleado:", error);
        return res.status(500).json({ ok: false, message: "Error al obtener el empleado" });
    }
}


// actualizar empleado
export const actualizarEmpleado = async (req, res) => {
    try {
        const { numerocedula } = req.params;
        const { primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo, cargo } = req.body;

        if (!numerocedula || !primernombre || !primerapellido || !numerotelefono || !correo || !cargo) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        const empleadoActualizado = await EmpleadoModel.actualizarEmpleado(
            numerocedula,
            primernombre,
            segundonombre,
            primerapellido,
            segundoapellido,
            numerotelefono,
            correo,
            cargo
        );

        if (!empleadoActualizado) {
            return res.status(404).json({ ok: false, message: "Empleado no encontrado" });
        }

        return res.status(200).json({
            ok: true,
            message: "Empleado actualizado correctamente",
            data: empleadoActualizado,
        });
    } catch (error) {
        console.error("Error al actualizar el empleado:", error);
        return res.status(500).json({ ok: false, message: "Error al actualizar el empleado" });
    }
};

  





// eliminar empleados 
export const eliminarEmpleado = async (req, res) => {
    try {
        const {numerocedula} = req.params;
        
        if(!numerocedula) {
            return res.status(400).json({message: "El numero de cedula es obligatorio"})
        }
        const empleadoEliminado = await EmpleadoModel.eliminarEmpleadoDB(numerocedula);
        return res.status(200).json({ok: true, message: "Empleado eliminado correctamente", data: empleadoEliminado,})


    } catch (error){
        return res.status(500).json({ok: false, message: "Error al eliminar el empleado"});
    }
}
  

