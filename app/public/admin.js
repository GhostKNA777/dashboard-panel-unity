//import  connection  from "../index";

// document.getElementById("on").addEventListener("click", function () {
  
//   // Puedes utilizar la conexión en este archivo
//   console.log("connection")
//   const query = 'SELECT * FROM nombre_de_la_tabla'; // Reemplaza 'nombre_de_la_tabla' con el nombre de tu tabla

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error al ejecutar la consulta:', error);
//       return;
//     }
//     res.render('feudal-donate', { resultados: results }); // Renderiza el archivo HTML y pasa los resultados como datos
//   });
// });

document.getElementById("closed_session").addEventListener("click", function () {
  document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None;Secure=true;';
  document.location.href = "/";
});




