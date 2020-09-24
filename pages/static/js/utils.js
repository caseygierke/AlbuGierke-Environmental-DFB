// Create the processDataCallback function to unpack json data retrieved from API
function processDataCallback() {

  // Get keys for user selection
  keys = Object.keys(jsondata[0]);
  // Create empty dictionary for gathering data
  plotDict = {};
  // Create empty arrays for storing states and dropdownKeys 
  states = [];
  dropdownKeys = [];

  // Loop through covidData to get plotable arrays
  for (var i = 0; i < jsondata.length; i++) {

    // Check if state is already in object/dictionary
    if (jsondata[i].state in plotDict) {

      // Check if the state is not already in states array
      if (!states.includes(jsondata[i].state)) {

        // Add state to states array
        states.push(jsondata[i].state);
        // Add state to dropdown menu
        addSelectOptions(selectstate, jsondata[i].state);
      }

      // Loop through keys
      for (k = 0; k < keys.length; k++) {

        // Check if value has specified display name
        if (keys[k] in displayNames) {
          // Add older values to begining
          plotDict[jsondata[i].state][displayNames[keys[k]]].unshift(jsondata[i][keys[k]]);
        } else {
          plotDict[jsondata[i].state][keys[k]].unshift(jsondata[i][keys[k]]);
        }

        // Check if key is in normalKeys
        if (normalKeys.includes(keys[k])) {
          plotDict[jsondata[i].state][`${displayNames[keys[k]]} Percentage`].unshift((jsondata[i][keys[k]] / (population[jsondata[i].state]) * perDenominator));
          // The line above has to be divided by population to normalize
        }

        // Check if keyFlag is false
        if (!keyFlag) {
          // Check if it does not exist yet and is in filterKeys
          if (filterKeys.indexOf(keys[k]) == -1)

            // Check if value has specified display name
            if (keys[k] in displayNames) {
              // Add key to dropdown menu
              // addSelectOptions(keyElement, displayNames[keys[k]]);
              dropdownKeys.push(displayNames[keys[k]]);
            } else {
              // addSelectOptions(keyElement, keys[k]);
              dropdownKeys.push(keys[k]);
            }

          // Check if key is in normalKeys
          if (normalKeys.includes(keys[k])) {
            // Add to dropdown menu
            // addSelectOptions(keyElement, `Normalized ${displayNames[keys[k]]}`);
            dropdownKeys.push(`${displayNames[keys[k]]} Percentage`);
          }
        }
      }
      keyFlag = true;
    } else {
      // Create new empty dictionary/object
      plotDict[jsondata[i].state] = {};

      // Loop through keys
      for (k = 0; k < keys.length; k++) {

        // Check if value has specified display name
        if (keys[k] in displayNames) {
          // Create new arrays for each key
          plotDict[jsondata[i].state][displayNames[keys[k]]] = [jsondata[i][keys[k]]];
        } else {
          plotDict[jsondata[i].state][keys[k]] = [jsondata[i][keys[k]]];
        }

        // Check if key is in normalKeys
        if (normalKeys.includes(keys[k])) {
          plotDict[jsondata[i].state][`${displayNames[keys[k]]} Percentage`] = [(jsondata[i][keys[k]] / (population[jsondata[i].state]) * perDenominator)];
          // The line above has to be divided by population to normalize
        }
      }
    }
  }

  // Sort dropdownKeys
  dropdownKeys.sort();

  // Loop through dropdownKeys and add to dropdown menu
  for (let value of dropdownKeys) {
    if (!excludeKeys.includes(value)) {
      addSelectOptions(keyElement, value);
    }
  }

  // Call plotChart function to plot data
  plotChart();
};


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

      // Loop through tableCols
      tableCols.forEach(function (col) {
          // Add latest data point to array
          dataArray.push(Math.round( plotDict[state][col].slice(-1)[0]*1000)/1000 );
      })
      // Add on Death Rate
      dataArray.push(Math.round( dataArray[5]/dataArray[1]*10000)/100);
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
  tableCols.forEach(function (col) {
    cols.push({ title: col });
  });
  // Add on Death Rate
  cols.push({ title: 'Death Rate'});

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

// Get data from API
function getData() {
  fetch(url)
    // This is a callback function
    .then(function (u) {
      return u.json();
    })
    // Setting the global jsondata variable 
    .then(function (json) {
      jsondata = json;
      
      // Call processDataCallback
      processDataCallback();
      
      document.getElementById('loader').style = "display: none";
      document.getElementById('data-content').style = "";

      // getTableData();
      createTable();
    });
}

// Create the plotChart function
const plotChart=() =>{

  // Create ctx variable which is a html element
  var ctx = document.getElementById("myChart");
  
  // Check if myChart exists and destroy if so
  if (myChart) {
    myChart.destroy();
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
    data: {
      labels: plotDict[plotState]["dateChecked"],
      datasets: [
        {
          data: plotDict[plotState][plotContent],
          label: plotState+'- '+plotContent,
          borderColor: "DarkBlue",
          fill: false,
        },
      ],
    },
  });
}

// Define large arrays

var tableCols = [
    "Positive Cases", 
    "Positive Cases Percentage", 
    "Positive Increase", 
    "Positive Increase Percentage", 
    "Total Deaths", 
    "Total Deaths Percentage", 
    "Death Increase", 
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
  'death', 
  'deathIncrease', 
  'hospitalized', 
  'hospitalizedCumulative', 
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
  'AL': 4903185, 
  'AK': 731545, 
  'AZ': 7278717, 
  'AR': 3017804, 
  'CA': 39512223, 
  'CO': 5758736, 
  'CT': 3565287, 
  'DE': 973764, 
  'DC': 705749, 
  'FL': 21477737, 
  'GA': 10617423, 
  'HI': 1415872, 
  'ID': 1787065, 
  'IL': 12671821, 
  'IN': 6732219, 
  'IA': 3155070, 
  'KS': 2913314, 
  'KY': 4467673, 
  'LA': 4648794, 
  'ME': 1344212, 
  'MD': 6045680, 
  'MA': 6892503, 
  'MI': 9986857, 
  'MN': 5639632, 
  'MS': 2976149, 
  'MO': 6137428, 
  'MT': 1068778, 
  'NE': 1934408, 
  'NV': 3080156, 
  'NH': 1359711, 
  'NJ': 8882190, 
  'NM': 2096829, 
  'NY': 19453561, 
  'NC': 10488084, 
  'ND': 762062, 
  'OH': 11689100, 
  'OK': 3956971, 
  'OR': 4217737, 
  'PA': 12801989, 
  'RI': 1059361, 
  'SC': 5148714, 
  'SD': 884659, 
  'TN': 6829174, 
  'TX': 28995881, 
  'UT': 3205958, 
  'VT': 623989, 
  'VA': 8535519, 
  'WA': 7614893, 
  'WV': 1792147, 
  'WI': 5822434, 
  'WY': 578759, 
  'PR': 3193694, 
}

