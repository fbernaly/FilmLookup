function search() {
  var str = document.getElementById("film_number").value;
  if (str == "") {
    document.getElementById("response").innerHTML = "Film number missing";
    return;
  } else {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if (xmlhttp.status == 200) {
          document.getElementById("response").innerHTML = xmlhttp.responseText;
        } else {
          alert('There was a problem with the request.');
        }
      }
    };
    xmlhttp.open('GET', 'api/films?number=' + str);
    xmlhttp.send();
  }
}

function lookup() {
  var filter, table, tr, matching, containing;
  filter = document.getElementById("film_number").value.toUpperCase();
  table = document.getElementById("films_table");
  tr = table.getElementsByTagName("tr");
  matching = document.getElementById("matching").checked;
  containing = document.getElementById("containing").checked;

  var hide = true

  for (var i = 0; i < tr.length; i++) {
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

function addRow(film) {
  var table = document.getElementById("films_table");
  var tr = document.createElement("TR");
  addColumn(tr, film['film_number']);
  addColumn(tr, film['location']);
  addColumn(tr, film['created_at']);
  table.appendChild(tr);
}

function addColumn(tr, text) {
  var td = document.createElement("TD");
  var textnode = document.createTextNode(text);
  td.appendChild(textnode);
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
