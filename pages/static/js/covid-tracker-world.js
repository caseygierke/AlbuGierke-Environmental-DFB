// Define url for API call
const url = "https://covid19api.herokuapp.com";

// Create jsondata and plotDict variables to store data
var jsondata;
var plotDict;
// Set default value for plotState
var plotNation = "US";
// Set default value for plotContent
var plotContent = 'Confirmed Cases';
// Create selectstate variable as html selectState dropdown element
var selectnation = document.getElementById("selectNation");
// Create keyElement variable as html selectKeys dropdown element
var keyElement = document.getElementById("selectKeys");
// for code optimization // to prevent repetation of plot content data
var keyFlag = false;
// Create filterKeys variable which is an array of keys that are not included in plot content
var filterKeys = ["date", "state", "hash","dateChecked"];
// Create perDenominator for normalization
perDenominator = 100
// Create myChart variable
var myChart;

var orderedDates = {};

// Call getData
getData();



