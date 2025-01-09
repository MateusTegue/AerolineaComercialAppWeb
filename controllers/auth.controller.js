import { UserModel } from '../models/user.model.js'; // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';

// Controlador de inicio de sesión
const loginUsuario = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si la contraseña es válida
    const user = await UserModel.verificarContraseña(username, password);

    // Generar un token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      'clave_secreta', // Cambia esto por una clave segura
      { expiresIn: '1h' }
    );

    // Guardar el token en las cookies
    res.cookie('auth_token', token, { httpOnly: true });

    // Redirigir al panel de administrador
    res.redirect('/administracion');
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(401).send(error.message);
  }
};

// Controlador de registro de usuario
const registroUsuario = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Intentando registrar usuario", { username, password });
    const user = await UserModel.crearUsuario(username, password);
    console.log("Usuario creado:", user);
    res.status(201).send(`Usuario ${user.username} creado exitosamente`);
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).send('Error al registrar el usuario');
  }
};

export const AuthController = {
  loginUsuario,
  registroUsuario,
};
