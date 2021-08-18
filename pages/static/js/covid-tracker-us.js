// Define url for API call
const url = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv";

// Create jsondata and plotDict variables to store data
var jsondata;
var csvData;
var plotDict;
// Set default value for plotState
var plotState = "New Mexico";
// Set default value for plotContent
var plotContent = 'Cases';
// Define number of data points to average over
averageNumber = 10;
// Create selectstate variable as html selectState dropdown element
var selectstate = document.getElementById("selectState");
// Create keyElement variable as html selectKeys dropdown element
var keyElement = document.getElementById("selectKeys");
// for code optimization // to prevent repetation of plot content data
var keyFlag = false;
// Create filterKeys variable which is an array of keys that are not included in plot content
var filterKeys = ["date", "state", "hash","dateChecked"];
// Create perDenominator for normalization
percentDenominator = 100
per10MilDenominator = 10000
// Create myChart variable
var myChart;

// Call getData
getData();

// Update average-message
document.getElementById('average-message').innerHTML = `* Averages are base on ${averageNumber} day averages`



