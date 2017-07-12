function validatePasswords() {
  var pass1 = document.getElementById("password").value;
  var pass2 = document.getElementById("confirm_password").value;
  if (pass1 != pass2) {
    document.getElementById("password").style.borderColor = "#E34234";
    document.getElementById("confirm_password").style.borderColor = "#E34234";
    alert("Passwords do not match.");
    return false;
  }
  return true;
}

function updateRole(id, admin) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {} else {}
    }
  };
  xmlhttp.open('PUT', 'api/users/' + id);
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  var role = admin == true ? "2" : "1";
  xmlhttp.send('role_id=' + role);
}
