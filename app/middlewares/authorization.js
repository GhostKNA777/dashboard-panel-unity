import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { usuarios } from "./../controllers/authentication.controller.js";

dotenv.config();

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
    return res.redirect("/admin")
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


export const methods = {
    soloAdmin,
    soloGhost,
    soloPublico,
}