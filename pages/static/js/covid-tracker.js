// Define url for API call
const url = "https://covidtracking.com/api/states/daily";

// Get data
let jsondata;
// default value
var plotState = "NY"; 
// default value
var plotContent = "positiveIncrease"; 
// select element  for state dd
var selectstate = document.getElementById("selectState"); 
// select element for content dd
var keyElement = document.getElementById("selectKeys"); 
// for code optimization // to prevent repetation of plot content data
var keyFlag = false; 
// key which are not included in plot content
var filterKeys = ["date", "state", "hash","dateChecked"]; 
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
  'positiveIncrease': 'Positive Increase',
  'recovered': 'Recovered',
  'total': 'Total',
  'totalTestResults': 'Total Test Results',
  'totalTestResultsIncrease': 'Total Test Results Increase'
}

fetch(url)
  .then(function (u) {
    return u.json();
  })
  .then(function (json) {
    jsondata = json;
    processDataCallback();
  });

var myChart;

const plotChart=() =>{
  
  // Plot everything
  var ctx = document.getElementById("myChart");
  if (myChart) {
    myChart.destroy();
  }
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
					labelString: displayNames[plotContent]+' ' + plotState,
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
          label: plotState+'- '+displayNames[plotContent],
          borderColor: "DarkBlue",
          fill: false,
        },
      ],
    },
  });
	
}

