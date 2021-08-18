// Create the processDataCallback function to unpack json data retrieved from API
function processDataCallback() {

  // Get keys for user selection
  keys = Object.keys(jsondata);

  // Create useKeys list
  useKeys = ['confirmed', 'deaths', 'recovered'];

  // Create empty dictionary for gathering data
  plotDict = {};
  // Create empty arrays for storing nations and dropdownKeys
  nations = [];
  dropdownKeys = [];

  // Loop through keys
  for (var i = 0; i < keys.length; i++) {

    // Check that the key is in useKeys
    if (useKeys.includes(keys[i])) {

      //   Get core key name
      keyPart = displayNames[keys[i]].split(" ")[1].slice(0,-1);

      // Add to dropdown keys
      dropdownKeys.push(displayNames[keys[i]]);
      dropdownKeys.push(`${displayNames[keys[i]]}- Percent`);
      dropdownKeys.push(`Daily ${keyPart} Rate`);
      dropdownKeys.push(`Daily ${keyPart} Rate- Percent`);

        // Loop through locations in key
        for (var j = 0; j < jsondata[keys[i]]['locations'].length; j++) {

          // Define temporary nation variable
          nation = jsondata[keys[i]]['locations'][j]['country']

          // Check if nation is not (!) in plotDict and add to plotDict
          if (!(nation in plotDict) ) {

            // Add blank dictionary value to plotDict for that nation
            plotDict[nation] = {};
            // Add nation to nations array
            nations.push(nation);
            // Add nation to dropdown menu
            addSelectOptions(selectnation, nation);
          }

          // Define a temporary history variable with the data
          var history = jsondata[keys[i]]['locations'][j]['history'];

          // Sort the history array so dates are properly ordered
          orderedData = orderDate(history);

          // Check if the nation is in multipleOccurance
          if (multipleOccurance.includes(nation)) {

            // Check if plotDict already has values
            if (displayNames[keys[i]] in plotDict[nation]) {

              // Call addValues to update orderedData with previous data
              orderedData = addValues(Object.values(orderedData), plotDict[nation][displayNames[keys[i]]]['Values']);

            } else {

              // Add the dates and values arrays as the value for current key for the current nation
              plotDict[nation][displayNames[keys[i]]] = {'Dates': Object.keys(orderedData), 'Values': values};
              // Start the loop over
              continue;
            }
          }

          // Create empty arrays to populate
          norm = [];
          rate = [];
          normRate = [];
          yesterday = 0;

          // Define variables to optimize execution
          values = Object.values(orderedData);
          denominator = (population[nation]) / perDenominator;

          // Loop through to do normalization division and get rates
          for (var d = 0; d < values.length; d++) {

            value = values[d];
            rate.push(value - yesterday);
            normRate.push((value - yesterday) / denominator);
            norm.push(value / denominator);
            yesterday = value;
          }

          // Add items to plotDict

          // Add the dates and values arrays as the value for current key for the current nation
          plotDict[nation][displayNames[keys[i]]] = {'Dates': Object.keys(orderedData), 'Values': values};
          // Add to the Percent key
          plotDict[nation][`${displayNames[keys[i]]}- Percent`] = {'Dates': Object.keys(orderedData), 'Values': norm};
          // Add to the Daily Case Rate key
          plotDict[nation][`Daily ${keyPart} Rate`] = {'Dates': Object.keys(orderedData), 'Values': rate};
          // Add to the Percent Per Day key
          plotDict[nation][`Daily ${keyPart} Rate- Percent`] = {'Dates': Object.keys(orderedData), 'Values': normRate};

      }
	  }
  }

  // Sort dropdownKeys
  dropdownKeys.sort();

  // Loop through dropdownKeys and add to dropdown menu
  for (let value of dropdownKeys) {
    addSelectOptions(keyElement, value);
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

// Define selectnation function to change plot with dropdown selection
const selectNation = () => {

  // Create a variable from html dropdown elements
  var e = document.getElementById("selectNation");
  // Get the selected value from html dropdown elements
  var selectednation = e.options[e.selectedIndex].value;
  // Update global variable plotNation
  plotNation = selectednation;
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

// Define getTableData
function getTableData() {

    // Create table array
    tableData = [];

    // Loop through nations
    nations.forEach(function (nation) {

      // Initiate data array
      if (nation in population) {
        dataArray = [nation, population[nation]];
      } else {
        dataArray = [nation, 0];
      }

      // Loop through tableCols
      tableCols.forEach(function (col) {

          // Add latest data point to array
          dataArray.push(Math.round( plotDict[nation][col]['Values'].slice(-1)[0]*1000)/1000 );
      })

      // Add on Death Rate
      dataArray.push(Math.round( dataArray[6]/dataArray[2]*10000)/100);
      // Add array to tableData
      tableData.push(dataArray);
    })
}

// Define createTable
function createTable() {

  // Call getTableData function
  getTableData();

  // Create empty cols array
  cols = [{title: 'Nation'}, {title: 'Population'}];

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
      scrollCollapse: true,
      "sScrollX": "100%",
      "sScrollXInner": "110%",
      "lengthMenu": [[-1, 10], ["All", 10]],
      columnDefs: [
        {
        //   type: "numeric-comma", targets: [1,10],
          "type": "scientific", targets: 5,
          targets: '_all',
          className: 'dt-center',
        }
      ]
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

      // Create a loader icon
      document.getElementById('loader').style = "display: none";
      document.getElementById('data-content').style = "";

      // Call createTable
      createTable();
    });
}

// Create dateConverter function
function dateConverter(date) {
  var dateParts = date.split("/");
  var dateObject = new Date(+dateParts[2], dateParts[0], +dateParts[1]);
  return dateObject
}

// Create the orderDate function
orderDate = (history) => {

  orderedData = {};
  // Sort the history array so dates are properly ordered
  Object.keys(history).sort(function(a, b) {
    return (dateConverter(a) - dateConverter(b));
  }).forEach(function(key) {
    orderedData[key] = history[key];
  });
  return orderedData;
}

// Define addValues
addValues = (newData, oldData) => {

  // Loop through data and add old to new
  var sum = newData.map(function (num, idx) {
    return num + oldData[idx];
  });

  return sum;
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
          labelString: plotContent+' ' + plotNation,
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
      labels: plotDict[plotNation]["Confirmed Cases"]['Dates'],
      datasets: [
        {
          data: plotDict[plotNation][plotContent]['Values'],
          label: plotNation+'- '+plotContent,
          borderColor: "DarkBlue",
          fill: false,
        },
      ],
    },
  });
}

// Define large arrays

var tableCols = [
    "Confirmed Cases",
    "Confirmed Cases- Percent",
    "Daily Case Rate",
    "Daily Case Rate- Percent",
    "Total Deaths",
    "Total Deaths- Percent",
    "Daily Death Rate",
    // "Daily Death Rate- Percent",
    // "Death Rate",
];

// Make variable for displaying data options
var displayNames = {
  'confirmed': 'Confirmed Cases',
  'deaths': 'Total Deaths',
  'recovered': 'Total Recovery'
}

population = {
  'China': 1439323776,
  'India': 1380004385,
  'US': 331002651,
  'Kosovo': 1801366,
  'Indonesia': 273523615,
  'Pakistan': 220892340,
  'Brazil': 212559417,
  'Nigeria': 206139589,
  'Bangladesh': 164689383,
  'Russia': 145934462,
  'Mexico': 128932753,
  'Japan': 126476461,
  'Ethiopia': 114963588,
  'Philippines': 109581078,
  'Egypt': 102334404,
  'Vietnam': 97338579,
  'Congo (Kinshasa)': 89561403,
  'Turkey': 84339067,
  'Iran': 83992949,
  'Germany': 83783942,
  'Thailand': 69799978,
  'United Kingdom': 67886011,
  'France': 65273511,
  'Italy': 60461826,
  'Tanzania': 59734218,
  'South Africa': 59308690,
  'Burma': 54409800,
  'Kenya': 53771296,
  'Korea, South': 51269185,
  'Colombia': 50882891,
  'Spain': 46754778,
  'Uganda': 45741007,
  'Argentina': 45195774,
  'Algeria': 43851044,
  'Sudan': 43849260,
  'Ukraine': 43733762,
  'Iraq': 40222493,
  'Afghanistan': 38928346,
  'Poland': 37846611,
  'Canada': 37742154,
  'Morocco': 36910560,
  'Saudi Arabia': 34813871,
  'Uzbekistan': 33469203,
  'Peru': 32971854,
  'Angola': 32866272,
  'Malaysia': 32365999,
  'Mozambique': 31255435,
  'Ghana': 31072940,
  'Yemen': 29825964,
  'Nepal': 29136808,
  'Venezuela': 28435940,
  'Madagascar': 27691018,
  'Cameroon': 26545863,
  "Cote d'Ivoire": 26378274,
  'North Korea': 25778816,
  'Australia': 25499884,
  'Niger': 24206644,
  'Taiwan*': 23816775,
  'Sri Lanka': 21413249,
  'Burkina Faso': 20903273,
  'Mali': 20250833,
  'Romania': 19237691,
  'Malawi': 19129952,
  'Chile': 19116201,
  'Kazakhstan': 18776707,
  'Zambia': 18383955,
  'Guatemala': 17915568,
  'Ecuador': 17643054,
  'Syria': 17500658,
  'Netherlands': 17134872,
  'Senegal': 16743927,
  'Cambodia': 16718965,
  'Chad': 16425864,
  'Somalia': 15893222,
  'Zimbabwe': 14862924,
  'Guinea': 13132795,
  'Rwanda': 12952218,
  'Benin': 12123200,
  'Burundi': 11890784,
  'Tunisia': 11818619,
  'Bolivia': 11673021,
  'Belgium': 11589623,
  'Haiti': 11402528,
  'Cuba': 11326616,
  'South Sudan': 11193725,
  'Dominican Republic': 10847910,
  'Czechia': 10708981,
  'Greece': 10423054,
  'Jordan': 10203134,
  'Portugal': 10196709,
  'Azerbaijan': 10139177,
  'Sweden': 10099265,
  'Honduras': 9904607,
  'United Arab Emirates': 9890402,
  'Hungary': 9660351,
  'Tajikistan': 9537645,
  'Belarus': 9449323,
  'Austria': 9006398,
  'Papua New Guinea': 8947024,
  'Serbia': 8737371,
  'Israel': 8655535,
  'Switzerland': 8654622,
  'Togo': 8278724,
  'Sierra Leone': 7976983,
  'Hong Kong': 7496981,
  'Laos': 7275560,
  'Paraguay': 7132538,
  'Bulgaria': 6948445,
  'Libya': 6871292,
  'Lebanon': 6825445,
  'Nicaragua': 6624554,
  'Kyrgyzstan': 6524195,
  'El Salvador': 6486205,
  'Turkmenistan': 6031200,
  'Singapore': 5850342,
  'Denmark': 5792202,
  'Finland': 5540720,
  'Congo (Brazzaville)': 5518087,
  'Slovakia': 5459642,
  'Norway': 5421241,
  'Oman': 5106626,
  'State of Palestine': 5101414,
  'Costa Rica': 5094118,
  'Liberia': 5057681,
  'Ireland': 4937786,
  'Central African Republic': 4829767,
  'New Zealand': 4822233,
  'Mauritania': 4649658,
  'Panama': 4314767,
  'Kuwait': 4270571,
  'Croatia': 4105267,
  'Moldova': 4033963,
  'Georgia': 3989167,
  'Eritrea': 3546421,
  'Uruguay': 3473730,
  'Bosnia and Herzegovina': 3280819,
  'Mongolia': 3278290,
  'Armenia': 2963243,
  'Jamaica': 2961167,
  'Qatar': 2881053,
  'Albania': 2877797,
  'Puerto Rico': 2860853,
  'Lithuania': 2722289,
  'Namibia': 2540905,
  'Gambia': 2416668,
  'Botswana': 2351627,
  'Gabon': 2225734,
  'Lesotho': 2142249,
  'North Macedonia': 2083374,
  'Slovenia': 2078938,
  'Guinea-Bissau': 1968001,
  'Latvia': 1886198,
  'Bahrain': 1701575,
  'Equatorial Guinea': 1402985,
  'Trinidad and Tobago': 1399488,
  'Estonia': 1326535,
  'Timor-Leste': 1318445,
  'Mauritius': 1271768,
  'Cyprus': 1207359,
  'Eswatini': 1160164,
  'Djibouti': 988000,
  'Fiji': 896445,
  'Réunion': 895312,
  'Comoros': 869601,
  'Guyana': 786552,
  'Bhutan': 771608,
  'Solomon Islands': 686884,
  'Macao': 649335,
  'Montenegro': 628066,
  'Luxembourg': 625978,
  'Western Sahara': 597339,
  'Suriname': 586632,
  'Cabo Verde': 555987,
  'Maldives': 540544,
  'Malta': 441543,
  'Brunei': 437479,
  'Guadeloupe': 400124,
  'Belize': 397628,
  'Bahamas': 393244,
  'Martinique': 375265,
  'Iceland': 341243,
  'Vanuatu': 307145,
  'French Guiana': 298682,
  'Barbados': 287375,
  'New Caledonia': 285498,
  'French Polynesia': 280908,
  'Mayotte': 272815,
  'Sao Tome and Principe': 219159,
  'Samoa': 198414,
  'Saint Lucia': 183627,
  'Channel Islands': 173863,
  'Guam': 168775,
  'Curaçao': 164093,
  'Kiribati': 119449,
  'Micronesia': 115023,
  'Grenada': 112523,
  'Saint Vincent and the Grenadines': 110940,
  'Aruba': 106766,
  'Tonga': 105695,
  'U.S. Virgin Islands': 104425,
  'Seychelles': 98347,
  'Antigua and Barbuda': 97929,
  'Isle of Man': 85033,
  'Andorra': 77265,
  'Dominica': 71986,
  'Cayman Islands': 65722,
  'Bermuda': 62278,
  'Marshall Islands': 59190,
  'Northern Mariana Islands': 57559,
  'Greenland': 56770,
  'American Samoa': 55191,
  'Saint Kitts and Nevis': 53199,
  'Faeroe Islands': 48863,
  'Sint Maarten': 42876,
  'Monaco': 39242,
  'Turks and Caicos': 38717,
  'Saint Martin': 38666,
  'Liechtenstein': 38128,
  'San Marino': 33931,
  'Gibraltar': 33691,
  'British Virgin Islands': 30231,
  'Caribbean Netherlands': 26223,
  'Palau': 18094,
  'Cook Islands': 17564,
  'Anguilla': 15003,
  'Tuvalu': 11792,
  'Wallis & Futuna': 11239,
  'Nauru': 10824,
  'Saint Barthelemy': 9877,
  'Saint Helena': 6077,
  'Saint Pierre & Miquelon': 5794,
  'Montserrat': 4992,
  'Falkland Islands': 3480,
  'Niue': 1626,
  'Tokelau': 1357,
  'Holy See': 801,
}

// Create multipleOccurance list
let multipleOccurance = [
  'China',
  'Canada',
  'France',
  'United Kingdom',
  'Australia',
  'Netherlands',
  'Denmark',
];

