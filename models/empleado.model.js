import { database } from "../database/conexion.js";



// crear empleados
const crearEmpledo = async (numerocedula , primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo, cargo) => { 
    const query = {
        text : `INSERT INTO empleado (numerocedula, primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo, cargo) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        values: [numerocedula, primernombre, segundonombre, primerapellido, segundoapellido, numerotelefono, correo, cargo],
    };

    const { rows } = await database.query(query);
    return rows[0];
}


// obtener empleados por numero de cedula 
const obtenerEmpleadoCedula = async (numerocedula) => {
    const query = {
        text: `SELECT * FROM empleado WHERE numerocedula = $1`,
        values: [numerocedula],
    };
    const { rows } = await database.query(query);
    return rows[0];
};


// mostrar empleados
const mostrarEmpleados = async () => {
    const { rows } = await database.query(`SELECT * FROM empleado`);
    return rows;
}

// actualizar empleados 
const actualizarEmpleado = async (
    numerocedula, 
    primernombre, 
    segundonombre, 
    primerapellido, 
    segundoapellido, 
    numerotelefono, 
    correo, 
    cargo
) => {
    try {
        const query = `
            UPDATE empleado 
            SET 
                primernombre = $1, 
                segundonombre = $2, 
                primerapellido = $3, 
                segundoapellido = $4, 
                numerotelefono = $5, 
                correo = $6, 
                cargo = $7 
            WHERE numerocedula = $8
            RETURNING *;
        `;
        const result = await database.query(query, [
            primernombre,
            segundonombre,
            primerapellido,
            segundoapellido,
            numerotelefono,
            correo,
            cargo,
            numerocedula, // Usado solo en WHERE
        ]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al actualizar el empleado", error);
        throw new Error("Error al actualizar el empleado");
    }
};




// eliminar empleados 
const eliminarEmpleadoDB = async (numerocedula) => {
    try {
        const query = "DELETE FROM empleado WHERE numerocedula = $1 RETURNING *";
        const { rows } = await database.query(query, [numerocedula]);

        if(rows.length === 0){
            return { message: "No se encontraron empleados con ese numero de cedula" };
        }
        return rows[0];

    } catch (error) {
       console.error("Error al eliminar el empleado");

    }

}





  


export const EmpleadoModel = {
    crearEmpledo,
    obtenerEmpleadoCedula,
    mostrarEmpleados,
    actualizarEmpleado,
    eliminarEmpleadoDB
}