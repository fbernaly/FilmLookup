function lookup() {
  var filter, table, tr, matching, containing;
  filter = document.getElementById("film_number").value.toUpperCase();
  table = document.getElementById("films_table");
  tr = table.getElementsByTagName("tr");
  matching = document.getElementById("matching").checked;
  containing = document.getElementById("containing").checked;

  var hide = true

  for (var i = 1; i < tr.length; i++) {
    var td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (filter == "" || (matching == true && td.innerHTML.toUpperCase() == filter) || (containing == true && td.innerHTML.toUpperCase().indexOf(filter) > -1)) {
        tr[i].style.display = "";
        hide = false
      } else {
        tr[i].style.display = "none";
      }
    }
  }

  table.style.opacity = hide ? 0 : 1;
  hide ? showNotFound() : hideNotFound();
  hide ? showAddButton() : hideAddButton()
}

function getFilms() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
        var json = JSON.parse(xmlhttp.responseText);
        setTimeout(function () {
          displayTable(json);
        }, 900);
      } else {
        alert('There was a problem with the request.');
        var p = document.getElementById("perror");
        p.style.visibility = "visible";
      }
      hideLoader();
    }
  };
  xmlhttp.open('GET', 'api/films');
  xmlhttp.send();
}

function hideLoader() {
  var loader = document.getElementById("loader");
  loader.style.opacity = 0;
  setTimeout(function () {
    loader.parentNode.removeChild(loader);
  }, 1000);
}

function displayTable(json) {
  var success = json["success"];
  var table = document.getElementById("films_table");
  if (success == true) {
    var films = json['data'];
    if (films.length > 0) {
      table.style.visibility = "visible";
      table.style.opacity = 1;
    } else {
      table.style.visibility = "hidden";
      table.style.opacity = 0;
    }
    for (film of films) {
      addRow(film);
    }
  } else {
    table.style.visibility = "hidden";
  }
}

function addRow(film, sibling) {
  var table = document.getElementById("films_table");
  var tr = document.createElement("TR");
  addColumn(tr, film['film_number']);
  addColumn(tr, film['location']);
  var date = new Date(film['created_at']);
  addColumn(tr, date.toLocaleString());
  if (sessionStorage.isAdmin == 'true') {
    addDeleteButton(tr, film['id'], film['film_number']);
  }
  if (sibling) {
    table.insertBefore(tr, sibling);
  } else {
    table.appendChild(tr);
  }
}

function addColumn(tr, text) {
  var td = document.createElement("TD");
  var textnode = document.createTextNode(text);
  td.appendChild(textnode);
  tr.appendChild(td);
}

function addDeleteButton(tr, id, number) {
  var td = document.createElement("TD");
  var button = document.createElement("BUTTON");
  button.onclick = function () {
    deleteFilm(id, number, tr);
  };
  var text = document.createTextNode("Delete");
  button.appendChild(text)
  td.appendChild(button);
  tr.appendChild(td);
}

function showNotFound() {
  var toast = document.getElementById("toast")
  var film_number = document.getElementById("film_number").value.toUpperCase();
  p = document.getElementById("ptoast");
  p.innerHTML = "'" + film_number + "' not found :("
  toast.style.transform = "translate(0px, -80px)";
  toast.style.opacity = 1;
  setTimeout(function () {
    hideNotFound();
  }, 1500);
}

function hideNotFound() {
  var toast = document.getElementById("toast")
  toast.style.transform = "translate(0px, 80px)";
  toast.style.opacity = 0;
}

function showAddButton() {
  var button = document.getElementById("add_button");
  if (sessionStorage.isAdmin == 'true') {
    button.style.display = ""
  }
}

function hideAddButton() {
  var button = document.getElementById("add_button");
  button.style.display = "none"
}

function addFilm() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
        var button = document.getElementById("add_button");
        button.style.display = "none"
        insertFilmInTable()
      } else {}
    }
  };
  xmlhttp.open('POST', 'api/films');
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  var number = document.getElementById("film_number").value
  var email = sessionStorage.email
  xmlhttp.send('number=' + number + '&email=' + email);
}

function deleteFilm(id, number, tr) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
        tr.parentNode.removeChild(tr);
        lookup()
        var p = document.getElementById("ptoast");
        p.innerHTML = "Film '" + number + "' deleted."
      } else {}
    }
  };
  xmlhttp.open('DELETE', 'api/films/' + id);
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xmlhttp.send();
}

function insertFilmInTable() {
  var number = document.getElementById("film_number").value;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
        var json = JSON.parse(xmlhttp.responseText);
        var success = json["success"];
        if (success == true) {
          var arr = json['data'];
          var film = arr[0];
          var sibling = searchFilmSiblingInTable()
          addRow(film, sibling)
          lookup()
        }
      } else {}
    }
  };
  xmlhttp.open('GET', 'api/films?number=' + number);
  xmlhttp.send();
}

function searchFilmSiblingInTable() {
  var number, table, tr, matching, containing;
  number = document.getElementById("film_number").value.toUpperCase();
  table = document.getElementById("films_table");
  tr = table.getElementsByTagName("tr");

  for (var i = 1; i < tr.length; i++) {
    var td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      var text = td.innerHTML.toUpperCase()
      if (parseInt(number) < parseInt(text)) {
        return tr[i];
      }
    }
  }
  return null;
}
