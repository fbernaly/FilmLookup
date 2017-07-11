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
