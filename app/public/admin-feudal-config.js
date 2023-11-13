import fs from 'fs';
import xml2js from 'xml2js';
import bodyParser from 'body-parser';
import dotenv from "dotenv";

dotenv.config();

const PATHFEUDALCONFIG = process.env.PATH_FEUDAL_CONFIG
//`${PATHFEUDALCONFIG}`
//FUNCION PRINCIPAL
export function adminFeudalConfigHandler(req, res) {
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

            // Obtener los valores 
            const adminPassword = result.config.adminPassword[0];
            const skillsStatsMult = result.config.skillsStatsMult[0];
            // Obtener los valores de skillcap
            const skillcapValues = result.config.skillcap[0].group;

            // Renderizar la vista EJS con los valores
            res.render('admin-feudal-config',
                {
                    adminPassword,
                    skillsStatsMult,
                    skillcapValues 
                });
        });
    });
}

export default adminFeudalConfigHandler;
