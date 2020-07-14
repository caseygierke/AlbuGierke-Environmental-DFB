
function processDataCallback() {
	
  console.log('Again')
  // Get keys for user selection
  // error was on this line, because jsondata array is empty. so, zero index is undefined.  it's due to Jsondata array is assigned inside then.
  keys = Object.keys(jsondata[0]); 

  // Create empty dictionary for gathering data
  plotDict = {};
  states = [];

  // Loop through covidData to get plotable arrays
  for (var i = 0; i < jsondata.length; i++) {
    // Check if state is already in object/dictionary
    if (jsondata[i].state in plotDict) {
      // Loop through keys

       // add Plot State options 
	   //addSelectOptions(selectstate,jsondata[i].state);
     if(!states.includes(jsondata[i].state)) {
      states.push(jsondata[i].state);
      addSelectOptions(selectstate,jsondata[i].state);
     }
     
	   
	   
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
};


// function to add options in select dd
const addSelectOptions =(targetElement, data)=>{
	
	let element = document.createElement("option");
    element.setAttribute("value", data);
    element.innerHTML = data;
    targetElement.appendChild(element);
	
};

 // Plot data on Chart
const selectState = () => {
  // if (plotExists === true) {
  //   myChart.destroy();
  //   console.log('Chart destroyed!');
  // }
  var e = document.getElementById("selectState");
  var selectedState = e.options[e.selectedIndex].value;
  plotState = selectedState;
  // console.log('State');
  plotChart()
  // plotExists = true;
};

const selectKeys = () => {
  var e = document.getElementById("selectKeys");
  var selectedKey = e.options[e.selectedIndex].value;
  plotContent = selectedKey;
  plotChart();
};

			