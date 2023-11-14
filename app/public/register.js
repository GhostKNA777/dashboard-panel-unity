const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("register-form").addEventListener("submit",async(e)=>{
  e.preventDefault();
  //console.log(e);
  //const userlog = e.target[0].value;
  //console.log(userlog);
  const res = await fetch("http://localhost:4000/webadmin/api/register",{
    method:"POST",
    headers:{
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
      user: e.target[0].value,
      email: e.target[1].value,
      password: e.target[3].value
    })
  });
  if(!res.ok) return mensajeError.classList.toggle("escondido",false);
  const resJson = await res.json();
  if(resJson.redirect){
    window.location.href = resJson.redirect;
  }
}) 