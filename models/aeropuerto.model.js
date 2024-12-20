import { text } from "express";
import { database } from "../database/conexion.js";

// crear los aeropuertos 
const crearAeropuetos = async ( nombre , ciudad , pais ) => {
    const query = {
             text : `INSERT INTO aeropuerto (nombre, ciudad, pais)
                     VALUES ($1, $2, $3) RETURNING *;`, 
                     values : [nombre, ciudad, pais]
    };

    const { rows } = await database.query(query);
    return rows;

};

// mostrar los aeropuertos disponibles 
const mostrarAeropuertos = async ( ) => {
    const result = await database.query("SELECT * FROM aeropuerto");
    res.json(result.rows);

};

// mostrar un aeropuerto por nombre
const mostrarAeropuertoNombre = async (req, res ) => {
    const { nombre } = req.params;
    const result = await database.query(`SELECT * FROM aeropuerto WHERE nombre = $1
        `, [nombre]);
        res.json(result.rows);
};


// exportar el modelo aeropuerto
export const AeropuertoModel = {
    crearAeropuetos,
    mostrarAeropuertos,
    mostrarAeropuertoNombre
};
