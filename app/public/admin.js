
document.getElementById("closed_session").addEventListener("click", function () {
  document.cookie = 'jwt=; Path=/webadmin; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None;Secure=true;';
  console.log("test redict")
  document.location.href = "/";
});










