
// Create the processDataCallback function to unpack json data retrieved from API
function processDataCallback() {

    // Create empty dictionary for gathering data
    plotDict = {};
    // Create empty arrays for storing states and dropdownKeys
    states = [];

    // Break data down into rows
    rows = csvData.split('\n');

    // Loop through covidData to get plotable arrays
    for (var i = 0; i < rows.length; i++) {

        // Break row down into columns
        cols = rows[i].split(',');

        // Define variables
        date = cols[0]
        state = cols[1]
        fips = cols[2]
        cases = cols[3]
        deaths = cols[4]

        // Check if state is already in object/dictionary
        if (state in plotDict) {

            // Check if the state is not already in states array
            if (!states.includes(state)) {

                // Add state to states array
                states.push(state);
            }

            // Update plotDict with new data
            plotDict[state]['Dates'].push(date);

            // Handle cases
            plotDict[state]['Case Rate'].push( cases - plotDict[state]['Cases'].slice(-1));
            plotDict[state]['Cases'].push(cases);
            plotDict[state]['Cases (% of Population)'].push(cases/population[state] * percentDenominator);
            plotDict[state]['Case Rate (per 10,000)'].push( plotDict[state]['Case Rate'].slice(-1) /population[state] * per10MilDenominator);

            // Handle deaths
            plotDict[state]['Death Rate'].push( deaths - plotDict[state]['Deaths'].slice(-1));
            plotDict[state]['Deaths'].push(deaths);
            plotDict[state]['Deaths (% of Population)'].push(deaths/population[state] * percentDenominator);
            plotDict[state]['Death Rate (per 10,000)'].push( plotDict[state]['Death Rate'].slice(-1) /population[state] * per10MilDenominator);

            // Fatality rate
            plotDict[state]['Fatality Rate (per 10,000 cases)'].push(deaths/cases * per10MilDenominator);

        } else {

            // Create new empty dictionary/object
            plotDict[state] = {};

            // Initialize fields
            plotDict[state]['Dates'] = [date];

            // Handle cases
            plotDict[state]['Cases'] = [Number(cases)];
            plotDict[state]['Case Rate'] = [Number(cases)];
            plotDict[state]['Cases (% of Population)'] = [cases/population[state] * percentDenominator];
            plotDict[state]['Case Rate (per 10,000)'] = [cases/population[state] * per10MilDenominator];

            // Handle deaths
            plotDict[state]['Deaths'] = [Number(deaths)];
            plotDict[state]['Death Rate'] = [Number(deaths)];
            plotDict[state]['Deaths (% of Population)'] = [deaths/population[state] * percentDenominator];
            plotDict[state]['Death Rate (per 10,000)'] = [deaths/population[state] * per10MilDenominator];

            // Fatality rate
            plotDict[state]['Fatality Rate (per 10,000 cases)'] = [deaths/cases * per10MilDenominator];

        }
    }

    // Sort states
    states.sort();

    // Loop through states
    for (let state of states) {

        // Add to dropdown menu
        addSelectOptions(selectstate, state);

        // Add Average Dates
        plotDict[state]["Average Dates"] = plotDict[state]["Dates"].slice(Math.floor(averageNumber/2),-Math.floor(averageNumber/2))

        // Add averages
        plotDict[state]['Average Case Rate'] = [];
        plotDict[state]['Average Case Rate (per 10,000)'] = [];
        plotDict[state]['Average Death Rate'] = [];
        plotDict[state]['Average Death Rate (per 10,000)'] = [];

        // Loop through data and populate averages
        for (var i = 0; i < plotDict[state]["Dates"].slice(Math.floor(averageNumber/2),-Math.floor(averageNumber/2)).length; i++) {

            plotDict[state]['Average Case Rate'].push( plotDict[state]['Case Rate'].slice(i,i+averageNumber).reduce((a, b) => a + b, 0) / averageNumber);
            plotDict[state]['Average Case Rate (per 10,000)'].push( plotDict[state]['Case Rate (per 10,000)'].slice(i,i+averageNumber).reduce((a, b) => a + b, 0) / averageNumber);
            plotDict[state]['Average Death Rate'].push( plotDict[state]['Death Rate'].slice(i,i+averageNumber).reduce((a, b) => a + b, 0) / averageNumber);
            plotDict[state]['Average Death Rate (per 10,000)'].push( plotDict[state]['Death Rate (per 10,000)'].slice(i,i+averageNumber).reduce((a, b) => a + b, 0) / averageNumber);
        }
    }

    // Populate dropdownKeys
    dropdownKeys = Object.keys(plotDict['Alabama'])

    // Sort dropdownKeys
    dropdownKeys.sort();
    states.sort();

    // Loop through dropdownKeys and add to dropdown menu
    for (let value of dropdownKeys) {
        if (!excludeKeys.includes(value)) {
            addSelectOptions(keyElement, value);
        }
    }

    // Call plotChart function to plot data
    plotChart();
};

// -------------------------------------------------------------------------------

// Define addSelectOptions function to add options in select dropdown
const addSelectOptions = (targetElement, data) => {

  // Create element variable as html element
  let element = document.createElement("option");
  // Set element's value
  element.setAttribute("value", data);
  // Set the element's html
  element.innerHTML = data;
  // Append the newly created element to the targetElement
  targetElement.appendChild(element);
};

// Define selectState function to change plot with dropdown selection
const selectState = () => {

  // Create a variable from html dropdown elements
  var e = document.getElementById("selectState");
  // Get the selected value from html dropdown elements
  var selectedState = e.options[e.selectedIndex].value;
  // Update global variable plotState
  plotState = selectedState;
  // Call plotChart function to plot data
  plotChart()
};

// Define selectKeys function to change plot with dropdown selection
const selectKeys = () => {
  // Create a variable from html dropdown elements
  var e = document.getElementById("selectKeys");
  // Get the selected value from html dropdown elements
  var selectedKey = e.options[e.selectedIndex].value;
  // Update global variable plotContent
  plotContent = selectedKey;
  // Call plotChart function to plot data
  plotChart();
};

// Convert population to array
var states = [], item;

for (var type in population) {
    item = {};
    item.type = type;
    item.name = population[type];
    states.push(item['type']);
}

// Define getTableData
function getTableData() {

    // Create table array
    tableData = [];

    // Loop through states
    states.forEach(function (state) {

        // Initiat data array
        dataArray = [state];

        // Loop through dropdownKeys and add to dropdown menu
        for (let col of dropdownKeys) {
            if (!excludeKeys.includes(col)) {

                // Add latest data point to array
                dataArray.push(Math.round( plotDict[state][col].slice(-1)[0]*100)/100 );
            }
        }

    // Add array to tableData
    tableData.push(dataArray);

    })
}

// Define createTable
function createTable() {

    // Call getTableData function
    getTableData();

    // Create empty cols array
    cols = [{title: 'State'}];

    // Loop through tableCols
    dropdownKeys.forEach(function (col) {
        if (!excludeKeys.includes(col)) {
            cols.push({ title: col });
        }
    });

    // Create table
    $(document).ready(function() {
    $('#data-table').DataTable( {
        data: tableData,
        columns: cols,
        scrollY: 300,
        "lengthMenu": [[-1, 10], ["All", 10]],
        "paging":   false,
        //   "ordering": false,
        columnDefs: [{
          targets: '_all',
          className: 'dt-center',
        }]
        });
    } );
}

u = '';

// Get data from API
function getData() {
    fetch(url)
        .then(function(res){
            if (!res.ok) {
                throw new Error("HTTP error " + res.status)
            }
            return res.text()
        }).then(function(data){
            // document.body.innerHTML += `<br><br>${data}`
            csvData = data;

            // Call processDataCallback
            processDataCallback();

            document.getElementById('loader').style = "display: none";
            document.getElementById('data-content').style = "";

            // getTableData();
            createTable();

        })
        .catch(function(err){
            console.log(err)
        })

        // // Call processDataCallback
        // processDataCallback();

        // document.getElementById('loader').style = "display: none";
        // document.getElementById('data-content').style = "";

        // // getTableData();
        // createTable();
};



// Create the plotChart function
const plotChart=() =>{

    // Create ctx variable which is a html element
    var ctx = document.getElementById("myChart");

    // Check if myChart exists and destroy if so
    if (myChart) {
    myChart.destroy();
    }

    // Check if datatype is Averaged
    if (plotContent.includes('Average')) {
        // Create dataObject
        dataObject = {
            labels: plotDict[plotState]["Average Dates"],
            datasets: [
                {
                    data: plotDict[plotState][plotContent],
                    label: plotState+'- '+plotContent,
                    borderColor: "DarkBlue",
                    fill: false,
                },
            ],
        }
    } else {
        // Create dataObject
        dataObject = {
            labels: plotDict[plotState]["Dates"],
            datasets: [
                {
                    data: plotDict[plotState][plotContent],
                    label: plotState+'- '+plotContent,
                    borderColor: "DarkBlue",
                    fill: false,
                },
            ],
        }
    }

    // Create myChart Chart object
    myChart = new Chart(ctx, {
    type: "line",
    options: {
        legend: {
            display: true,
            labels: {
                fontColor: 'DarkBlue'
            }
        },
     scales: {
            xAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        return  new Date(value).toUTCString().substr(0,12);
                    }
                },
        scaleLabel: {
          display: true,
          fontSize: 20,
          fontStyle:'italic'
          }
            }],
       yAxes: [{
          scaleLabel: {
          display: true,
          labelString: plotContent+' ' + plotState,
          fontSize: 20,
          }
        }]
        },
    tooltips: {
            // Disable the on-canvas tooltip
            enabled: true,
       callbacks: {
        title: function(tooltipItem, data) {
                    return new Date(tooltipItem[0].xLabel).toUTCString();;
                },
            }
      }
    },
    data: dataObject,
    // data: {
    //   labels: plotDict[plotState]["Dates"],
    //   datasets: [
    //     {
    //       data: plotDict[plotState][plotContent],
    //       label: plotState+'- '+plotContent,
    //       borderColor: "DarkBlue",
    //       fill: false,
    //     },
    //   ],
    // },
    });
}

// Define large arrays

var tableCols = [
    "Cases",
    // "Cases Percentage",
    // "Positive Increase",
    // "Positive Increase Percentage",
    "Deaths",
    // "Deaths Percentage",
    // "Death Increase",
    // "Death Rate",
];

// Make variable for displaying data options
var displayNames = {
  'death': 'Total Deaths',
  'deathIncrease': 'Death Increase',
  'hospitalized': 'Hospitalized',
  'hospitalizedCumulative': 'Hospitalized Cumulative',
  'hospitalizedCurrently': 'Hospitalized Currently',
  'hospitalizedIncrease': 'New Hospitalizations',
  'inIcuCumulative': 'Total number that have been in ICU',
  'inIcuCurrently': 'People currently in ICU',
  'negative': 'Negative',
  'negativeIncrease': 'Negative Increase',
  'onVentilatorCumulative': 'On Ventilator Cumulative',
  'onVentilatorCurrently': 'On Ventilator Currently',
  'pending': 'Pending',
  'posNeg': 'Positive Negative',
  'positive': 'Positive Cases',
  'positiveCasesViral': 'Positive Cases Viral',
  'positiveIncrease': 'Positive Increase',
  'recovered': 'Recovered',
  'total': 'Total',
  'totalTestResults': 'Total Test Results',
  'totalTestEncountersViral': 'Total Test Encounters Viral',
  'totalTestResultsIncrease': 'Total Test Results Increase'
}

var normalKeys = [
  'Cases',
  'Cases per day',
  'Deaths',
  'Deaths per day',
  'hospitalizedCurrently',
  'hospitalizedIncrease',
  'inIcuCumulative',
  'inIcuCurrently',
  'negative',
  'negativeIncrease',
  'onVentilatorCumulative',
  'onVentilatorCurrently',
  'positive',
  'positiveIncrease',
  'recovered',
  'total',
  'totalTestResults',
  'totalTestResultsIncrease',
]

var excludeKeys = [
  'Average Dates',
  'Dates',
  'Pending',
  'Total number that have been in ICU',
  'checkTimeEt',
  'commercialScore',
  'dataQualityGrade',
  'deathConfirmed',
  'dateModified',
  'deathProbable',
  'fips',
  'grade',
  'lastUpdateEt',
  'negativeRegularScore',
  'negativeScore',
  'negativeTestsAntibody',
  'negativeTestsPeopleAntibody',
  'negativeTestsViral',
  'positiveScore',
  'positiveTestsAntibody',
  'positiveTestsAntigen',
  'positiveTestsPeopleAntibody',
  'positiveTestsPeopleAntigen',
  'positiveTestsViral',
  'score',
  'totalTestResultsSource',
  'totalTestsAntibody',
  'totalTestsAntigen',
  'totalTestsPeopleAntibody',
  'totalTestsPeopleAntigen',
  'totalTestsPeopleViral',
  'totalTestsViral',
  'Total number that have been in ICU Percentage'

]

var population = {
    "Alabama":  4903185,
    "Alaska":  731545,
    "Arizona":  7278717,
    "Arkansas":  3017804,
    "California":  39512223,
    "Colorado":  5758736,
    "Connecticut":  3565287,
    "Delaware":  973764,
    "District of Columbia":  705749,
    "Florida":  21477737,
    "Georgia":  10617423,
    "Guam": 167294,
    "Hawaii":  1415872,
    "Idaho":  1787065,
    "Illinois":  12671821,
    "Indiana":  6732219,
    "Iowa":  3155070,
    "Kansas":  2913314,
    "Kentucky":  4467673,
    "Louisiana":  4648794,
    "Maine":  1344212,
    "Maryland":  6045680,
    "Massachusetts":  6892503,
    "Michigan":  9986857,
    "Minnesota":  5639632,
    "Mississippi":  2976149,
    "Missouri":  6137428,
    "Montana":  1068778,
    "Nebraska":  1934408,
    "Nevada":  3080156,
    "New Hampshire":  1359711,
    "New Jersey":  8882190,
    "New Mexico":  2096829,
    "New York":  19453561,
    "North Carolina":  10488084,
    "North Dakota":  762062,
    "Northern Mariana Islands": 57216,
    "Ohio":  11689100,
    "Oklahoma":  3956971,
    "Oregon":  4217737,
    "Pennsylvania":  12801989,
    "Puerto Rico":  3193694,
    "Rhode Island":  1059361,
    "South Carolina":  5148714,
    "South Dakota":  884659,
    "Tennessee":  6829174,
    "Texas":  28995881,
    "Utah":  3205958,
    "Vermont":  623989,
    "Virgin Islands": 106631,
    "Virginia":  8535519,
    "Washington":  7614893,
    "West Virginia":  1792147,
    "Wisconsin":  5822434,
    "Wyoming":  578759,
}

