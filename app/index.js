import express from 'express';
import http from 'http';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { methods as authentication } from "./controllers/authentication.controller.js"
import { methods as authorization } from "./middlewares/authorization.js";
import dotenv from "dotenv";
import mysql from 'mysql';
import ejs from 'ejs';
import adminHandler from './public/admin-all.js';
import adminAionHandler from './public/admin-aion.js';
import adminFeudalHandler from './public/admin-feudal.js';
import adminFeudalConfigHandler from './public/admin-feudal-config.js';

dotenv.config();


//ENV
//APP
const PORTAPP = process.env.PORT_APP
const ADDRESAPP = process.env.ADDRES_APP
//DATABASE FEUDAL
const DBHOSTF = process.env.DB_HOSTF
const DBUSERF = process.env.DB_USERF
const DBPORTF = process.env.DB_PORTF
const DBPASSF = process.env.DB_PASSF
const DBNAMEF = process.env.DB_NAMEF

//DATABASE AION LS
const DBHOSTALS = process.env.DB_HOSTALS
const DBUSERALS = process.env.DB_USERALS
const DBPORTALS = process.env.DB_PORTALS
const DBPASSALS = process.env.DB_PASSALS
const DBNAMEALS = process.env.DB_NAMEALS

//DATABASE AION LS
const DBHOSTAGS = process.env.DB_HOSTAGS
const DBUSERAGS = process.env.DB_USERAGS
const DBPORTAGS = process.env.DB_PORTAGS
const DBPASSAGS = process.env.DB_PASSAGS
const DBNAMEAGS = process.env.DB_NAMEAGS

//CONNECTION DB
export const connection = mysql.createConnection({
    host: DBHOSTF, 
    port: DBPORTF, 
    user: DBUSERF, 
    password: DBPASSF, 
    database: DBNAMEF
});
connection.connect((error) => {
    if (error) {
        console.error('Error al conectar a la base de datos:', error);
        return;
    }
    console.log('DB CONNECT OK');
});

//DIR
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Server
const app = express();
app.set('port', PORTAPP);

// Configuración de Pug como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(app.get('port'));
console.log('SERVER RUN PORT', app.get('port'), `${ADDRESAPP}/webadmin`);

//Configuracion
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())


// Routes
// app.get("/",authorization.soloPublico, (req,res)=> res.sendFile(__dirname + "/pages/login.html"));
// app.get("/register",authorization.soloPublico,(req,res)=> res.sendFile(__dirname + "/pages/register.html"));
// app.get("/admin",authorization.soloAdmin,(req,res)=> res.sendFile(__dirname + "/pages/admin/admin.html"));
// app.get("/admin/feudaldonate",authorization.soloGhost,(req,res)=> res.sendFile(__dirname + "/pages/admin/feudal-donate.html"));
// app.post("/api/login",authentication.login);
// app.post("/api/register",authentication.register);


app.get("/", (req, res) => { res.redirect("/webadmin/login");});
app.get("/webadmin", (req, res) => { res.redirect("/webadmin/login");});
app.get("/webadmin/login", authorization.soloPublico, (req, res) => res.render('login'));
app.get("/webadmin/register", authorization.soloPublico, (req, res) => res.render('register'));
app.post("/webadmin/api/login", authentication.login);
app.post("/webadmin/api/register", authentication.register);
app.post("/webadmin/api/aprobated", authentication.aprobated);
app.get("/webadmin/admin/feudaldonate", authorization.soloGhost, (req, res) => {
    connection.query('SELECT * FROM cms_donate_toll', (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            return;
        }
        res.render('feudal-donate', { datos: results });
    });
});
app.get("/webadmin/admin", authorization.soloAdmin, adminHandler);
app.get("/webadmin/admin/aion", authorization.soloAdmin, adminAionHandler);
app.get("/webadmin/admin/feudal", authorization.soloAdmin, adminFeudalHandler);
app.get("/webadmin/admin/feudalconfig", authorization.soloAdmin, adminFeudalConfigHandler);
app.post("/webadmin/api/closedProcesoFeudal", authorization.closedGSFeudal);
app.post("/webadmin/api/openProcesoFeudal", authorization.openGSFeudal);
app.post("/webadmin/api/statusProcesoFeudal", authorization.statusGSFeudal);
app.post("/webadmin/api/configFeudalSave", authorization.saveConfigFeudal);




function executeQuery(query) {
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


// Middleware para manejar rutas no definidas
app.use(function (req, res, next) {
    res.status(404).send("Error: Ruta no encontrada");
});
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Error en el servidor');
  });

export default connection;









