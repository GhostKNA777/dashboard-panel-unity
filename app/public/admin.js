
document.getElementById("closed_session").addEventListener("click", function() {
  document.cookie ='jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None;Secure=true;';
  document.location.href = "/";
});


