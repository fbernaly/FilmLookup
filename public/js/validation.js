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
