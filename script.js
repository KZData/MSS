document.addEventListener("DOMContentLoaded", function () {
  // Fetch data and create bar chart
  fetch("https://raw.githubusercontent.com/KZData/Baqylau/main/Data/V_MAIN_UNFILTERED_PUBLISHED.json")
      .then(response => response.json())
      .then(jsonData => {
          const jsonObj = jsonData;

          var trace = {
              x: jsonObj.map(item => (item['Запланированная Сумма'] / 1000000).toFixed(2)),
              y: jsonObj.map(item => item['Заказчик']),
              orientation: 'h',
              type: 'bar',
              marker: {
                  color: 'rgba(55,128,191,0.6)',
                  width: 1
              },
              text: jsonObj.map(item => (item['Запланированная Сумма'] / 1000000).toFixed(2) + ' млн'),
              textposition: 'outside'
          };

          var data = [trace];

          var layout = {
              title: 'Top 10 Атырауских гос учреждений по сумме запланированных Закупок (в млн)',
              xaxis: {
                  title: 'Запланированная сумма (млн)',
                  showticklabels: false,
              },
              yaxis: {
                  tickangle: -45
              },
              barmode: 'stack'
          };

          var config = {
              responsive: true
          };

          Plotly.newPlot("bar-plot", data, layout, config);

          document.getElementById('bar-plot').on('plotly_click', function (data) {
              var index = data.points[0].pointNumber;
              alert('Заказчик: ' + jsonObj[index]['Заказчик'] + ', Запланированная сумма: ' + jsonObj[index]['Запланированная Сумма']);
          });

      })
      .catch(error => console.error('Error:', error));

  // Create search table
  createSearchTable();
});

function createSearchTable() {
  const container = document.getElementById('table-container');

  const html = `
      <label for="column">Select Column:</label>
      <select id="column">
          <option value="LotNo">Lot Number</option>
          <option value="LotTitle">Lot Title</option>
          <option value="LotRequestor">Lot Requestor</option>
          <option value="Customers">Customers</option>
          <!-- Add more options based on your JSON structure -->
      </select>

      <br>

      <label for="searchText">Search Text:</label>
      <input type="text" id="searchText">

      <br>

      <button onclick="searchData()">Search</button>

      <br>

      <table id="searchTable">
          <!-- Table content will be dynamically added here -->
      </table>
  `;

  container.innerHTML = html;
}

function searchData() {
  const column = document.getElementById('column').value;
  const searchText = document.getElementById('searchText').value.toLowerCase();

  fetch("https://raw.githubusercontent.com/KZData/Baqylau/main/Data/V_MAIN_UNFILTERED_PUBLISHED.json")
      .then(response => response.json())
      .then(jsonData => {
          const filteredData = jsonData.filter(item => item[column].toLowerCase().includes(searchText));
          displaySearchResults(filteredData);
      })
      .catch(error => console.error('Error:', error));
}

function displaySearchResults(data) {
  const table = document.getElementById('searchTable');

  // Clear previous table content
  table.innerHTML = '';

  if (data.length === 0) {
      // Display a message when no results are found
      const noResultsRow = document.createElement('tr');
      const noResultsCell = document.createElement('td');
      noResultsCell.textContent = 'No results found';
      noResultsCell.colSpan = 999; // Set a large colspan to span the entire row
      noResultsRow.appendChild(noResultsCell);
      table.appendChild(noResultsRow);
      return;
  }

  const columns = Object.keys(data[0]);

  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  columns.forEach(column => {
      const th = document.createElement('th');
      th.textContent = column;
      headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');

  data.forEach(item => {
      const row = document.createElement('tr');

      columns.forEach(column => {
          const td = document.createElement('td');
          td.textContent = item[column];
          row.appendChild(td);
      });

      tbody.appendChild(row);
  });

  table.appendChild(tbody);
}
