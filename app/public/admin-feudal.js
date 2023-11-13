import mysql from 'mysql';
import dotenv from "dotenv";
import net from 'net';
import io from 'socket.io-client';


dotenv.config();

//DATABASE FEUDAL
const DBHOSTF = process.env.DB_HOSTF
const DBUSERF = process.env.DB_USERF
const DBPORTF = process.env.DB_PORTF
const DBPASSF = process.env.DB_PASSF
const DBNAMEF = process.env.DB_NAMEF

//FUNCION PARA CONECTAR AL SOCKET
function connectToGame(server, portgame, timeout) {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();

        socket.setTimeout(timeout);

        socket.on('connect', () => {
            resolve(socket);
        });

        socket.on('timeout', () => {
            reject(new Error('La conexión ha expirado'));
            socket.destroy();
        });

        socket.on('error', (error) => {
            reject(error);
            socket.destroy();
        });

        socket.connect(portgame, server);
    });
}

//FUNCION PRINCIPAL
export function adminFeudalHandler(req, res) {

    // Configuración de DATABASE FEUDAL
    const ConnectFeudal = mysql.createConnection({
        host: DBHOSTF,
        port: DBPORTF,
        user: DBUSERF,
        password: DBPASSF,
        database: DBNAMEF
    });
    ConnectFeudal.connect((error) => {
        if (error) {
            console.error('Error al conectar a la base de datos del Feudal:', error);
            return;
        }
        console.log('Conexión exitosa a la base de datos del Feudal');
        // Cantidad de Cuentas
        const query1 = 'SELECT * FROM account';
        ConnectFeudal.query(query1, (error, feudalAccountCount) => {
            if (error) {
                console.error('Error al ejecutar la consulta en la feudalAccountCount:', error);
                return;
            }
            //console.log('Resultados de la base de feudalAccountCount:', feudalAccountCount);


            const connections = [
                { server: 'localhost', port: 3306, timeout: 5000 },
                { server: 'localhost', port: 28000, timeout: 5000 },
                { server: 'localhost', port: 12000, timeout: 5000 },
                // Agrega más conexiones aquí si es necesario
            ];

            const connectionPromises = connections.map((connection) => {
                return connectToGame(connection.server, connection.port, connection.timeout)
                    .then((socket) => {
                        console.log(`Conexión exitosa en el puerto ${connection.port}`);
                        return { port: connection.port, success: true };
                    })
                    .catch((error) => {
                        console.error(`Error al conectar en el puerto ${connection.port}: ${error}`);
                        return { port: connection.port, success: false };
                    });
            });

            Promise.all(connectionPromises)
                .then((results) => {
                    const puerto3306 = results.find((result) => result.port === 3306 && result.success)
                        ? '3306'
                        : 'error 3306';

                    const puerto28000 = results.find((result) => result.port === 28000 && result.success)
                        ? '28000'
                        : 'error 28000';

                    const puerto12000 = results.find((result) => result.port === 12000 && result.success)
                        ? '12000'
                        : 'error 12000';

                    res.render('admin-feudal', {
                        feudalinfo: feudalAccountCount,
                        puerto3306: puerto3306,
                        puerto28000: puerto28000,
                        puerto12000: puerto12000
                    }); 
                })
                .catch((error) => {
                    console.error('Error al conectar:', error);
                    //  const puerto7777 = 'Error al conectar en el puerto7777';
                    // const puerto2106 = 'Error al conectar en el puerto2106';
                    // const puerto11000 = 'Error al conectar en el puerto11000';
                    res.render('admin-feudal', {
                        feudalinfo: feudalAccountCount,
                        puerto3306: puerto3306,
                        puerto28000: puerto28000,
                        puerto12000: puerto12000
                    });
                });
            // Renderiza la vista "admin" y pasa los datos como variables
            // res.render('admin', { feudalinfo: feudalAccountCount, datos2: results2, datos3: results3 });
            //res.render('admin', { feudalinfo: feudalAccountCount, datos2: results2, datos3: results3, puertos: resultados });
        });
    });
}

export default adminFeudalHandler;
