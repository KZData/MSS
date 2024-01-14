document.addEventListener("DOMContentLoaded", function () {
    fetch("https://raw.githubusercontent.com/KZData/MSS/main/Data/V_MAIN_UNFILTERED_PUBLISHED.json")
        .then(response => response.json())
        .then(jsonData => {
            const top20Data = getTop20Data(jsonData, "Запланированная сумма");
            createBarChart(top20Data);
        })
        .catch(error => console.error('Error:', error));
});

function getTop20Data(data, sortBy) {
    return data
        .sort((a, b) => b[sortBy] - a[sortBy])
        .slice(0, 20);
}

function createBarChart(data) {
    const names = data.map(item => item["Название"]);
    const amounts = data.map(item => item["Запланированная сумма"]);

    const trace = {
        x: names,
        y: amounts,
        type: 'bar',
    };

    const layout = {
        title: 'Top 20 "Название" by "Запланированная сумма"',
        xaxis: {
            title: 'Название',
        },
        yaxis: {
            title: 'Запланированная сумма',
        },
    };

    Plotly.newPlot('bar-chart', [trace], layout);
}
