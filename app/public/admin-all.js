import mysql from 'mysql';
import dotenv from "dotenv";
import net from 'net';
import io from 'socket.io-client';

//dotenv.config();

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

//DATABASE AION GS
const DBHOSTAGS = process.env.DB_HOSTAGS
const DBUSERAGS = process.env.DB_USERAGS
const DBPORTAGS = process.env.DB_PORTAGS
const DBPASSAGS = process.env.DB_PASSAGS
const DBNAMEAGS = process.env.DB_NAMEAGS

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

export function adminHandler(req, res) {
  //console.log("Código ejecutado en la ruta /admin");
  // Configuración de DATABASE FEUDAL
  const ConnectFeudal = mysql.createConnection({
    host: DBHOSTF,
    port: DBPORTF,
    user: DBUSERF,
    password: DBPASSF,
    database: DBNAMEF
  });
  // Configuración de AION LS
  const ConnectAionLS = mysql.createConnection({
    host: DBHOSTALS,
    port: DBPORTALS,
    user: DBUSERALS,
    password: DBPASSALS,
    database: DBNAMEALS
  });
  // Configuración de AION GS
  const ConnectAionGS = mysql.createConnection({
    host: DBHOSTAGS,
    port: DBPORTAGS,
    user: DBUSERAGS,
    password: DBPASSAGS,
    database: DBNAMEAGS
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
        console.error('Error al ejecutar la consulta en la base de datos 1:', error);
        return;
      }
      //console.log('Resultados de la base de datos 1:', feudalAccountCount);



      ConnectAionLS.connect((error) => {
        if (error) {
          console.error('Error al conectar a la base de datos del Aion LS:', error);
          return;
        }
        console.log('Conexión exitosa a la base de datos del Aion LS');

        // Ejemplo de consulta a la segunda base de datos
        const query2 = 'SELECT * FROM account_data';
        ConnectAionLS.query(query2, (error, results2) => {
          if (error) {
            console.error('Error al ejecutar la consulta en la base de datos 2:', error);
            return;
          }
          // console.log('Resultados de la base de datos 2:', results2);



          ConnectAionGS.connect((error) => {
            if (error) {
              console.error('Error al conectar a la base de datos del Aion GS:', error);
              return;
            }
            console.log('Conexión exitosa a la base de datos del Aion GS');

            let puerto7777; // Declarar la variable fuera de la función de devolución de llamada
            // Ejemplo de consulta a la segunda base de datos
            const query3 = 'SELECT * FROM players';
            ConnectAionGS.query(query3, (error, results3) => {
              if (error) {
                console.error('Error al ejecutar la consulta en la base de datos 2:', error);
                return;
              }
              // console.log('Resultados de la base de datos 2:', results3);

              const connections = [
                { server: 'localhost', port: 80, timeout: 5000 },
                { server: 'localhost', port: 81, timeout: 5000 },
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
                  const puerto7777 = results.find((result) => result.port === 80 && result.success)
                    ? 'Conexión exitosa en el puerto 7777'
                    : 'Error al conectar en el puerto 7777';
              
                  const puerto8888 = results.find((result) => result.port === 8888 && result.success)
                    ? 'Conexión exitosa en el puerto 8888'
                    : 'Error al conectar en el puerto 8888';
              
                  res.render('admin', {
                    feudalinfo: feudalAccountCount,
                    datos2: results2,
                    datos3: results3,
                    puerto7777: puerto7777,
                    puerto8888: puerto8888,
                  });
                })
                .catch((error) => {
                  console.error('Error al conectar:', error);
                  const puerto7777 = 'Error al conectar en el puerto 7777';
                  const puerto8888 = 'Error al conectar en el puerto 8888';
                  res.render('admin', {
                    feudalinfo: feudalAccountCount,
                    datos2: results2,
                    datos3: results3,
                    puerto7777: puerto7777,
                    puerto8888: puerto8888,
                  });
                });
              // Renderiza la vista "admin" y pasa los datos como variables
              // res.render('admin', { feudalinfo: feudalAccountCount, datos2: results2, datos3: results3 });
              //res.render('admin', { feudalinfo: feudalAccountCount, datos2: results2, datos3: results3, puertos: resultados });
            });
          });
        });
      });
    });

  });
}

export default adminHandler;