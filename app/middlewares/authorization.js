import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { usuarios } from "./../controllers/authentication.controller.js";
import { exec } from 'child_process';
import fs from 'fs';
import xml2js from 'xml2js';
import bodyParser from 'body-parser';

dotenv.config();

const PATHFEUDAL = process.env.PATH_FEUDAL
const PATHFEUDALCONFIG = process.env.PATH_FEUDAL_CONFIG

function soloGhost(req, res, next) {
    const logueado = revisarCookie(req);
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    if (decodificada.user === "GhostKNA") {
        // console.log(usuarioAResvisar);
        if (logueado) return next();
        return res.redirect("/")
    } else {
        console.log("No se encontró ningún usuario con el nombre 'GhostKNA'");
    }
}

function soloAdmin(req, res, next) {
    // console.log("COOKIE", req.headers.cookie)
    const logueado = revisarCookie(req);
    if (logueado) return next();
    return res.redirect("/")
}


function soloPublico(req, res, next) {
    const logueado = revisarCookie(req);
    if (!logueado) return next();
    return res.redirect("/")
}

function revisarCookie(req) {
    try {
        const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
        const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
        //console.log("decodificada:", decodificada)
        const usuarioAResvisar = usuarios.find(usuario => usuario.user === decodificada.user);
        //console.log("usuarioAResvisar:", usuarioAResvisar)
        if (!usuarioAResvisar) {
            return false
        }
        return true;
    }
    catch {
        return false;
    }
}

//Closed Service Feudal Game Server
function closedGSFeudal(req, res, next) {
    console.log("closedGSFeudal")
    exec('taskkill /F /IM ddctd_cm_yo_server.exe', (error, stdout, stderr) => {
        if (error) {
            console.error('Error al cerrar el proceso:', error);
            res.status(500).send('Error al cerrar el proceso');
        } else {
            console.log('Proceso cerrado exitosamente');
            res.sendStatus(200);
        }
    });
}


//Closed Service Feudal Game Server
function openGSFeudal(req, res, next) {
    console.log("openGSFeudal")
    // Comando para verificar si el proceso está en ejecución
    const comandoVerificar = 'tasklist /FI "IMAGENAME eq ddctd_cm_yo_server.exe"';

    // Comando para iniciar el proceso si no está en ejecución
    const comandoIniciar = `start ${PATHFEUDAL}`;

    // Verificar si el proceso está en ejecución
    exec(comandoVerificar, (error, stdout, stderr) => {
        if (error) {
            console.error('Error al ejecutar el comando:', error);
            res.status(500).send('Error al ejecutar el comando');
        } else {
            if (stdout.includes('ddctd_cm_yo_server.exe')) {

                console.log('El proceso ya está en ejecución open');


                res.write('<span><button type="button" class="btn btn-success" style="vertical-align:0px;margin-left: 10px;">El proceso ya está en ejecución</button></span>');
                res.end();
            } else {
                console.log('Proceso iniciado exitosamente 1');
                res.sendStatus(200);
                // Iniciar el proceso si no está en ejecución
                exec(comandoIniciar, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Error al iniciar el proceso:', error);
                    } else {
                        console.log('Proceso que se a iniciado exitosamente se ha cerrado');
                    }
                });
            }
        }
    });
}

//Status Service Feudal Game Server
function statusGSFeudal(req, res, next) {
    console.log("statusGSFeudal")
    // Comando para verificar si el proceso está en ejecución
    const comandoVerificar = 'tasklist /FI "IMAGENAME eq ddctd_cm_yo_server.exe"';
    // Verificar si el proceso está en ejecución
    exec(comandoVerificar, (error, stdout, stderr) => {
        if (error) {
            console.error('Error al ejecutar el comando:', error);
            res.status(500).send('Error al ejecutar el comando');
        } else {
            if (stdout.includes('ddctd_cm_yo_server.exe')) {

                //console.log('El proceso ya está en ejecución');
                res.write('<span><button type="button" class="btn btn-success" style="vertical-align:0px;margin-left: 10px;">Servidor Iniciado <span class="spinner-border spinner-border-sm" aria-hidden="true"></span></button></span>');
                res.end();
            } else {
                //console.log('El proceso ya no está en ejecuciónxx');
                res.write('<span><button type="button" class="btn btn-danger" style="vertical-align:0px;margin-left: 10px;">Servicio Apagado <span class="spinner-border spinner-border-sm" aria-hidden="true"></span></button></span>');
                res.end();
            }
        }
    });
}

//Salvar Config Feudal .xml
function saveConfigFeudal(req, res, next) {
    console.log("saveConfigFeudal")
    console.log(req.body.adminPassword)
    console.log(req.body.skillsStatsMult)


    fs.readFile(`${PATHFEUDALCONFIG}`, 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
    
        // Parsear el XML a formato JSON
        xml2js.parseString(data, (err, result) => {
          if (err) {
            console.error(err);
            return;
          }
    
          // Obtener los nuevos valores del formulario
          const newAdminPassword = req.body.adminPassword;
          const newskillsStatsMult = req.body.skillsStatsMult;
    
          // Actualizar los valores en el JSON
          result.config.adminPassword[0] = newAdminPassword;
          result.config.skillsStatsMult[0] = newskillsStatsMult;
    
          // Convertir el JSON modificado a XML
          const builder = new xml2js.Builder();
          const xml = builder.buildObject(result);
    
          // Guardar los nuevos valores en el mismo archivo XML
          fs.writeFile(`${PATHFEUDALCONFIG}`, xml, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log('Valores guardados exitosamente en el archivo XML.');
           // res.redirect('/');
           res.sendStatus(200);
          });
        });
      }); 
    
}


export const methods = {
    soloAdmin,
    soloGhost,
    soloPublico,
    closedGSFeudal,
    openGSFeudal,
    statusGSFeudal,
    saveConfigFeudal
}