// Define url for API call
const url = "https://covidtracking.com/api/states/daily";

// https://stackoverflow.com/questions/48474970/saving-fetched-json-into-variable
// Get data
let jsondata;
var plotState = "NY"; // default value
var plotContent = "positive"; // default value
var selectstate = document.getElementById("selectState"); // select element  for state dd
var keyElement = document.getElementById("selectKeys"); // select element for content dd
var keyFlag = false; // for code optimization // to prevent repetation of plot content data
var filterKeys = ["date", "state", "hash"]; // key which are not included in plot content

fetch(url)
  .then(function (u) {
    return u.json();
  })
  .then(function (json) {
    jsondata = json;
    // Here due to then(on complete), javascript execution thread didn't wait for api response
    //and code execute before api response. So, processDataCallback function is called when api
    //response data successfully converted to json object
    processDataCallback();
  });

function processDataCallback() {
	
  // Get keys for user selection
  keys = Object.keys(jsondata[0]); // error was on this line, because jsondata array is empty. so, zero index is undefined.  it's due to Jsondata array is assigned inside then.
  
  // Create empty dictionary for gathering data
  plotDict = {};

  // Loop through covidData to get plotable arrays
  for (var i = 0; i < jsondata.length; i++) {
    // Check if state is already in object/dictionary
    if (jsondata[i].state in plotDict) {
      // Loop through keys

       // add Plot State options 
	   addSelectOptions(selectstate,jsondata[i].state);
	   
	   
      for (k = 0; k < keys.length; k++) {
        // plotDict.jsondata[i].state.key.unshift(jsondata[i].key);
        // Add older values to begining
        plotDict[jsondata[i].state][keys[k]].unshift(jsondata[i][keys[k]]);
		
		 // add Plot Content options 
		if(!keyFlag){
			if(filterKeys.indexOf(keys[k]) == -1)// filtering keys 
				addSelectOptions(keyElement,keys[k]);
		}
      }
	  keyFlag= true;
    } else {
      // Create new empty dictionary/object
      plotDict[jsondata[i].state] = {};

      // Loop through keys
      for (k = 0; k < keys.length; k++) {
        // Create new arrays for each key
        plotDict[jsondata[i].state][keys[k]] = [jsondata[i][keys[k]]];
        //console.log(plotDict[jsondata[i].state][keys[k]],"plotDict[jsondata[i].state][keys[k]] in else");
      }
    }
  }

 plotChart();
}

// function to add options in select dd
const addSelectOptions =(targetElement, data)=>{
	
	let element = document.createElement("option");
    element.setAttribute("value", data);
    element.innerHTML = data;
    targetElement.appendChild(element);
	
}

const plotChart=() =>{
	
 // Plot everything
  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: plotDict[plotState]["date"],
      datasets: [
        {
          data: plotDict[plotState][plotContent],
          label: plotState,
          borderColor: "DarkBlue",
          fill: false,
        },
      ],
    },
  });
	
}

 // Plot data on Chart
const selectState = () => {
  var e = document.getElementById("selectState");
  var selectedState = e.options[e.selectedIndex].value;
  plotState = selectedState;
  plotChart();
};

const selectKeys = () => {
  var e = document.getElementById("selectKeys");
  var selectedKey = e.options[e.selectedIndex].value;
  plotContent = selectedKey;
  plotChart();
};
