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

  for (var i = 0; i < tr.length; i++) {
    var td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (filter == "") {
        tr[i].style.display = "";
      } else if (matching == true && td.innerHTML.toUpperCase() == filter) {
        tr[i].style.display = "";
      } else if (containing == true && td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function getFilms() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
        var json = JSON.parse(xmlhttp.responseText);
        displayTable(json);
      } else {
        alert('There was a problem with the request.');
      }
    }
  };
  xmlhttp.open('GET', 'api/films');
  xmlhttp.send();
}

function displayTable(json) {
  var loader = document.getElementById("loader");
  loader.parentNode.removeChild(loader);
  var success = json["success"];
  var table = document.getElementById("films_table");
  if (success == true) {
    table.style.visibility = "visible";
    var films = json['data'];
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
