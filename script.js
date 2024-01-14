let searchDataResults = [];

document.addEventListener("DOMContentLoaded", function () {
    createBarChart([]); // Empty chart by default
    createSearchTable();
});

function searchData() {
    const columnElement = document.getElementById('column');
    const columnEnglish = columnElement.value;
    const columnRussian = columnElement.options[columnElement.selectedIndex].text;
    const searchText = document.getElementById('searchText').value.toLowerCase();

    fetch("https://raw.githubusercontent.com/KZData/MSS/main/Data/V_MAIN_UNFILTERED_PUBLISHED.json")
        .then(response => response.json())
        .then(jsonData => {
            searchDataResults = jsonData.filter(item => {
                const value = item[columnEnglish] || item[columnRussian];
                return value?.toLowerCase().includes(searchText);
            });

            displaySearchResults(searchDataResults);
            createBarChart(getTop20Data(searchDataResults, "Запланированная сумма"));
        })
        .catch(error => console.error('Error:', error));
}

function getTop20Data(data, sortBy) {
    return data
        .sort((a, b) => b[sortBy] - a[sortBy])
        .slice(0, 20);
}

function createSearchTable() {
    const container = document.getElementById('table-container');

    const html = `
        <label for="column">Выберите столбец:</label>
        <select id="column">
            <option value="Номер объявления">Номер объявления</option>
            <option value="Название">Название</option>
            <option value="Организатор">Организатор</option>
            <option value="Метод Закупки">Метод Закупки</option>
            <option value="Дата начала приема заявок">Дата начала приема заявок</option>
            <option value="Время начала">Время начала</option>
            <option value="Дата окончания">Дата окончания</option>
            <option value="Время окончания">Время окончания</option>
            <option value="Запланированная сумма">Запланированная сумма</option>
            <option value="Статус">Статус</option>
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

    container.innerHTML = html;
}

function clearSearch() {
    document.getElementById('searchText').value = '';
    searchData();
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
            
            // Check if the column is the URL column
            if (column === 'Ссылка на объявление на сайте goszakup') {
                const link = document.createElement('a');
                link.href = item[column];
                link.textContent = item[column];
                link.target = '_blank'; // Open the link in a new tab
                td.appendChild(link);
            } else {
                td.textContent = item[column];
            }

            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
}
