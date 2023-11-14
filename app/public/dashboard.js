

//Función para guardar el proceso
document.getElementById("save-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(e);
  const adminPassword = e.target[0].value;
  const skillsStatsMult = e.target[1].value;
  console.log(adminPassword);
  console.log(skillsStatsMult);
  const res = await fetch(`http://127.0.0.1:4000/webadmin/api/configFeudalSave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      adminPassword,
      skillsStatsMult
    })
  });
})


//Función para cerrar el proceso
function iniciarProceso() {
  fetch(`http://127.0.0.1:4000/webadmin/api/openProcesoFeudal`, { method: 'POST' })
    .then(response => {
      if (response.ok) {
        console.log('Proceso Iniciado exitosamente');
        setInterval(() => {
          window.location.href = '/webadmin/admin/feudal';
        }, 2000); // 2000 milisegundos = 2 segundos
      } else {
        console.error('Error al iniciar el proceso');
      }
    })
    .catch(error => {
      console.error('Error al iniciar el proceso:', error);
    });
}

//Función para cerrar el proceso
function cerrarProceso() {
  fetch(`http://127.0.0.1:4000/webadmin/api/closedProcesoFeudal`, { method: 'POST' })
    .then(response => {
      if (response.ok) {
        console.log('Proceso cerrado exitosamente');
        setInterval(() => {
          window.location.href = '/webadmin/admin/feudal';
        }, 2000); // 2000 milisegundos = 2 segundos
      } else {
        console.error('Error al cerrar el proceso');
      }
    })
    .catch(error => {
      console.error('Error al cerrar el proceso:', error);
    });
}




 