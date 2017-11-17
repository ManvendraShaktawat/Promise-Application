window.onload = function() {
	var peopleResponse, filmsResponse;

	fetchDataFromAPI("https://swapi.co/api/people/?format=json").then(function(response) {
		peopleResponse = JSON.parse(response).results;
		if(filmsResponse) {
			populateTableOnBothAPIResponse(peopleResponse, filmsResponse);
		}
	});

	fetchDataFromAPI("https://swapi.co/api/films/?format=json").then(function(response) {
		var index1, index2;
		filmsResponse = JSON.parse(response).results.sort(function(a, b) {
			index1 = a.url.split("/");
			index1 = parseInt(index1[index1.length-2]);
			index2 = b.url.split("/");
			index2 = parseInt(index2[index2.length-2]);
			return index1-index2;
		});
		if(peopleResponse) {
			populateTableOnBothAPIResponse(peopleResponse, filmsResponse);
		}
	});

	document.querySelectorAll("#searchBoxes input").forEach(function(inputBox) {
		inputBox.addEventListener("input", function() {
			populateTableOnBothAPIResponse(peopleResponse, filmsResponse);
		});
	});
}

function populateTableOnBothAPIResponse(peopleResponse, filmsResponse) {
	var rowObj = {};
	var searchBoxes = document.querySelectorAll("#searchBoxes input");

	document.querySelector("#dataListContainer tbody").innerHTML = "";
	
	peopleResponse.filter(function(person) {
		if(person.name.indexOf(searchBoxes[0].value) !== -1) {
			return true;
		}
	}).filter(function(person) {
		if(person.gender.indexOf(searchBoxes[1].value) !== -1) {
			return true;
		}
	}).filter(function(person) {
		if(person.birth_year.indexOf(searchBoxes[2].value) !== -1) {
			return true;
		}
	}).map(function(person) {
		rowObj.name = person.name;
		rowObj.gender = person.gender;
		rowObj.birthYear = person.birth_year;
		rowObj.titles = [];
		person.films.forEach(function(film) {
			film = film.split("/");
			film = parseInt(film[film.length-2]);
			rowObj.titles.push(filmsResponse[film-1].title);
		});
		rowObj.titles = rowObj.titles.filter(function(title) {
			if(title.indexOf(searchBoxes[3].value) !== -1) {
				return true;
			}
		});
		createTableData(rowObj);
	});
}

function fetchDataFromAPI(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

function createTableData({name, gender, birthYear, titles}) {
	var newRow = createTableRow(name, gender, birthYear);
	var newTitleList = createUnorderedList(titles);
	newRow.querySelector("td:last-child").appendChild(newTitleList);
	document.querySelector("#dataListContainer tbody").appendChild(newRow);
}

function createTableRow(...fields) {
	var tableRow, tableData, textNode;
	tableRow = document.createElement("tr");
	fields.forEach(function(field) {
		tableData = document.createElement("td");
		tableData.classList.add("col-lg-3");
		textNode = document.createTextNode(field);
		tableData.appendChild(textNode);
		tableRow.appendChild(tableData);
	});
	tableData = document.createElement("td");
	tableRow.appendChild(tableData);
	return tableRow;
}

function createUnorderedList(titles) {
	var ul, li, textNode;
	ul = document.createElement("ul");
	ul.classList.add("list-group");
	ul.style.margin = "0 0 0 16px";
	titles.map(function(title) {
		li = document.createElement("li");
		textNode = document.createTextNode(title);
		li.appendChild(textNode);
		ul.appendChild(li);
	});
	return ul;
}