

const mensajeError = document.getElementsByClassName("error")[0]


document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(e);
  //const user = e.target.children.user.value;
  const user = e.target[0].value;
  const password = e.target[1].value;
  const res = await fetch('http://127.0.0.1:4000/webadmin/api/login', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user, password
    })
  });
  if (!res.ok) return mensajeError.classList.toggle("escondido", false);
  const resJson = await res.json();
  if (resJson.redirect) {
    window.location.href = resJson.redirect;
  }
})
