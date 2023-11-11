import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

export const usuarios = [
  {
    user: "GhostKNA",
    email: "ern777gavilanes@gmail.com",
    password: "$2a$05$1XOovHQkiCwdncnk3POaR.K5uZ8WcVZOtCd751JoVc5NKPAuAY62m"
    //asus+fronco+#
  },
  {
    user: "randy",
    email: "ern777gavilanes@gmail.com",
    password: "$2a$05$vW6La9vxWYbb7IzygcZ8FuSoHIWz8YsXy42Sh4wwjCbym86WTES.q"
    //asus+fronco+#
  }
];

//password: "$2a$05$vW6La9vxWYbb7IzygcZ8FuSoHIWz8YsXy42Sh4wwjCbym86WTES.q" //a


async function login(req, res) {
  console.log(req.body);
  const user = req.body.user;
  const password = req.body.password;
  if (!user || !password) {
    console.log("Los campos están incompletos");
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" })
  }
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  if (!usuarioAResvisar) {
    console.log("Error durante login");
    return res.status(400).send({ status: "Error", message: "Error durante login" })
  }
  const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);
  if (!loginCorrecto) {
    console.log("Error durante login 2");
    return res.status(400).send({ status: "Error", message: "Error durante login" })
  }
  const token = jsonwebtoken.sign(
    { user: usuarioAResvisar.user },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION });

  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    path: "/",
    SameSite: "None",
    secure: true
  }

  res.cookie("jwt", token, cookieOption);
  res.send({ status: "ok", message: "Usuario loggeado", redirect: "/admin" });
  console.log('Login User:', user);
}

async function register(req, res) {
  const user = req.body.user;
  const email = req.body.email;
  const password = req.body.password;
  // console.log('user Log:', user);
  // console.log('password Log:', password);
  // console.log('email Log:', email);
  if (!user || !email || !password) {
    console.log("Los campos están incompletos 2");
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" })
  }
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  if (usuarioAResvisar) {
    console.log("Este usuario ya existe");
    return res.status(400).send({ status: "Error", message: "Este usuario ya existe" })
  }
  const salt = await bcryptjs.genSalt(5);
  const hashPassword = await bcryptjs.hash(password, salt);
  const nuevoUsuario = {
    user, email, password: hashPassword
  }
  usuarios.push(nuevoUsuario);
  console.log(usuarios);
  return res.status(201).send({ status: "ok", message: `Usuario ${nuevoUsuario.user} agregado`, redirect: "/" })
}

export const methods = {
  login,
  register
}