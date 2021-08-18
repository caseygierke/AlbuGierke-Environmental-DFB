<<<<<<< HEAD
// Define url for API call
// const url = "https://covidtracking.com/api/states/daily";
const url = "https://api.covidtracking.com/v1/states/daily.json";

// Create jsondata and plotDict variables to store data
var jsondata;
var plotDict;
// Set default value for plotState
var plotState = "NM";
// Set default value for plotContent
var plotContent = 'Positive Increase';
// Create selectstate variable as html selectState dropdown element
var selectstate = document.getElementById("selectState");
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

// Call getData
getData();



=======
// Define url for API call
// const url = "https://covidtracking.com/api/states/daily";
const url = "https://api.covidtracking.com/v1/states/daily.json";

// Create jsondata and plotDict variables to store data
var jsondata;
var plotDict;
// Set default value for plotState
var plotState = "NY";
// Set default value for plotContent
var plotContent = 'Positive Increase';
// Create selectstate variable as html selectState dropdown element
var selectstate = document.getElementById("selectState");
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

// Call getData
getData();



>>>>>>> 32e0c8f8d1087b6828214b75e22cfea0a79b59d8
