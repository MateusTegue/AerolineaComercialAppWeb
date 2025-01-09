import bcrypt from 'bcrypt';
import { database } from '../database/conexion.js'; // Asegúrate de que esta es la ruta correcta

// Crear un nuevo usuario
const crearUsuario = async (username, password) => {
  try {
    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de salt rounds

    // Insertar el usuario con la contraseña cifrada
    const query = {
      text: `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`,
      values: [username, hashedPassword],
    };

    const { rows } = await database.query(query);

    return rows[0]; // Devuelve el usuario creado
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw new Error('Error al crear el usuario');
  }
};

// Verificar si la contraseña es válida
const verificarContraseña = async (username, password) => {
  try {
    // Buscar el usuario en la base de datos
    const query = {
      text: `SELECT * FROM users WHERE username = $1`,
      values: [username],
    };

    const { rows } = await database.query(query);

    if (rows.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const user = rows[0];

    // Comparar la contraseña proporcionada con la contraseña cifrada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    return user; // Devuelve el usuario si la contraseña es correcta
  } catch (error) {
    console.error('Error al verificar la contraseña:', error);
    throw error;
  }
};

export const UserModel = {
  crearUsuario,
  verificarContraseña,
};
