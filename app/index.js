import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import {fileURLToPath} from 'url';
import {methods as authentication} from "./controllers/authentication.controller.js"
import {methods as authorization} from "./middlewares/authorization.js";

import mysql from 'mysql';



const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Server
const app = express();
app.set('port', 4000);
app.listen(app.get('port'));
console.log('Servidor Corriendo en el puerto', app.get('port'));

//Configuracion
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser())

// Routes
app.get("/",authorization.soloPublico, (req,res)=> res.sendFile(__dirname + "/pages/login.html"));
app.get("/register",authorization.soloPublico,(req,res)=> res.sendFile(__dirname + "/pages/register.html"));
app.get("/admin",authorization.soloAdmin,(req,res)=> res.sendFile(__dirname + "/pages/admin/admin.html"));
app.get("/admin/feudaldonate",authorization.soloGhost,(req,res)=> res.sendFile(__dirname + "/pages/admin/feudal-donate.html"));
app.post("/api/login",authentication.login);
app.post("/api/register",authentication.register);


export const connection = mysql.createConnection({
    host: 'localhost', // Cambia esto al host de tu base de datos
    user: 'root', // Cambia esto al nombre de usuario de tu base de datos
    password: 'aion777kna777', // Cambia esto a la contraseña de tu base de datos
    database: 'lif_1' // Cambia esto al nombre de tu base de datos
  });
  
  connection.connect((error) => {
    if (error) {
      console.error('Error al conectar a la base de datos:', error);
      return;
    }
    console.log('Conexión exitosa a la base de datos');
  });

  
  
  export default connection;

