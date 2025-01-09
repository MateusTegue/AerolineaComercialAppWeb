import jwt from "jsonwebtoken";

export const verificarAutenticacion = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.redirect("/login"); 
  }

  try {
    const user = jwt.verify(token, "clave_secreta"); 
    next();
  } catch (error) {
    console.error("Token no válido:", error);
    res.redirect("/login");
  }
};
