import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import {fileURLToPath} from 'url';
import {methods as authentication} from "./controllers/authentication.controller.js"
import {methods as authorization} from "./middlewares/authorization.js";

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
app.get("/admin/feudaldonate",authorization.soloGhost,(req,res)=> res.sendFile(__dirname + "/pages/admin/admin.html"));
app.post("/api/login",authentication.login);
app.post("/api/register",authentication.register);


