document.addEventListener("DOMContentLoaded", function () {
    // Create search table
    createSearchTable();
});

function createSearchTable() {
    const container = document.getElementById('table-container');

    const html = `
        <label for="column">Выберите столбец:</label>
        <select id="column">
            <option value="Announce Number">Номер объявления</option>
            <option value="Announce Name">Название</option>
            <option value="Announce Organizer">Организатор</option>
            <option value="Announce Method">Метод Закупки</option>
            <option value="Start Date">Дата начала приема заявок</option>
            <option value="Start Time">Время начала</option>
            <option value="End Date">Дата окончания</option>
            <option value="End Time">Время окончания</option>
            <option value="Announce Amount">Запланированная сумма</option>
            <option value="Announce Status">Статус</option>
            <!-- Add more options based on your JSON structure -->
        </select>

        <br>

        <label for="searchText">Текст поиска:</label>
        <input type="text" id="searchText" placeholder="Искать по критериям">

        <br>

        <button onclick="searchData()">Поиск</button>
        <button onclick="clearSearch()">Очистить</button>

        <br>

        <table id="searchTable">
            <!-- Table content will be dynamically added here -->
        </table>
    `;

    // JavaScript function to clear the search
    function clearSearch() {
        document.getElementById('searchText').value = '';
        searchData();
    }

    container.innerHTML = html;
}

function searchData() {
    const column = document.getElementById('column').value;
    const searchText = document.getElementById('searchText').value.toLowerCase();

    fetch("https://raw.githubusercontent.com/KZData/MSS/main/Data/V_MAIN_UNFILTERED_PUBLISHED.json")
        .then(response => response.json())
        .then(jsonData => {
            const filteredData = jsonData.filter(item => item[column]?.toLowerCase().includes(searchText));
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
