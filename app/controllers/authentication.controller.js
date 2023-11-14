import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import connection from "../index.js";

dotenv.config();

export const usuarios = [
  {
    user: "GhostKNA",
    email: "ern777gavilanes@gmail.com",
    password: "$2a$05$1XOovHQkiCwdncnk3POaR.K5uZ8WcVZOtCd751JoVc5NKPAuAY62m"
    
  },
  {
    user: "saitama89",
    email: "randybenzol@gmail.com",
    password: "$2a$05$l/UCT5HQI5YhXZrGdUNYq.MsghFbug8d5l5NUfhk3eEY8F7klXqCu"
    
  }
];




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
    return res.status(400).send({ status: "Error", message: "Error durante login1" })
  }
  const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);
  if (!loginCorrecto) {
    console.log("Error durante login 2");
    return res.status(400).send({ status: "Error", message: "Error durante login2" })
  }
  const token = jsonwebtoken.sign(
    { user: usuarioAResvisar.user },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION });

  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    path: "/webadmin",
    SameSite: "None",
    secure: true
  }

  res.cookie("jwt", token, cookieOption);
  res.send({ status: "ok", message: "Usuario loggeado", redirect: "/webadmin/admin" });
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

async function aprobated(req, res) {
  try {
    console.log(req.body);
    const accountId = req.body.accountId;
    const tollAmount = req.body.tollAmount;
    const transactionId = req.body.transactionId;
    if (!accountId || !tollAmount || !transactionId) {
      console.log("Faltan Valores");
      return res.status(400).send({ status: "Error", message: "Faltan Valores" });
    }
    
    // Consulta para buscar el registro con el accountId
    const selectQuery = `SELECT * FROM account WHERE ID = ${accountId}`;
    const results = await executeQuery(connection, selectQuery);
    if (results.length === 0) {
      console.log("No se encontró ningún registro con el accountId proporcionado");
      return res.status(404).send({ status: "Error", message: "No se encontró ningún registro con el accountId proporcionado" });
    }

    // Actualizar el campo tollAmount con el valor proporcionado
    const updateQuery = `UPDATE account SET gold_coins = gold_coins + ${tollAmount} WHERE ID = ${accountId}`;
    await executeQuery(connection, updateQuery);

    const updateTollQuery = `UPDATE cms_donate_toll SET status = 'COMPLETED', updated_at = NOW() WHERE transaction_id = '${transactionId}'`;
    await executeQuery(connection, updateTollQuery);

    console.log("Registro actualizado correctamente");
    return res.status(200).send({ status: "Success", message: "Registro actualizado correctamente" });
  } catch (error) {
    console.error('Error en la función aprobated:', error);
    return res.status(500).send({ status: "Error", message: "Error en la función aprobated" });
  } finally {
   // connection.end();
  }
}

function executeQuery(connection, query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export default aprobated;


export const methods = {
  login,
  register,
  aprobated
}