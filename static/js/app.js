var bellybuttonData;

// initialize data
function init(){
    // Dropdown Menu 
    var dropdownMenu = d3.select("#selDataset");
   // JSON data
    d3.json("data/samples.json").then((data) =>{
        bellybuttonData = data;
        var subjectID = data.names;
        subjectID.forEach((ID) => {
            dropdownMenu.append('option').text(ID).property('value', ID);
        });
        const selectID = subjectID[0];
        buildPlot(selectID);
        updateMetadata(selectID);
    });
}

function buildPlot(sample) {    
    // Grab values from the json object
    d3.json("data/samples.json").then((data) => {
    var samples = data.samples;
    
    var filterData = samples.filter(sampleObject => sampleObject.id == sample);
    var result = filterData[0];
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    
    
    var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
        colorscale:"Darkmint"
        }
    };
     //  top 10 OTUs in each individual
    var sample_values_10 = result.sample_values.slice(0, 10).reverse();
    
    var OTU = (result.otu_ids.slice(0, 10)).reverse();
    
    var OTU_id = OTU.map(d => "OTU " + d)
    //  get top 10 labels for each OTU
    var labels = result.otu_labels.slice(0, 10).reverse();
   
    // create data variable for trace layout
    var data = [trace1];
    var layout = {
        showlegend: false,
        autorange: true,
        hovermode: 'closest',
        xaxis: {title:"OTU ID"},
        margin: {t:20}
    };
    //Create Bubble plot
    Plotly.newPlot('bubble', data, layout); 
    var trace1 = {
        x: sample_values_10,
        y: OTU_id,
        text: labels,
        type: "bar",
        orientation: "h"
    };
    // create bar chart
    var data = [trace1];
    var layout = {
        title: "Top Ten OTU's " +sample,
        margin: {l: 100, r: 100, t: 100, b: 100},
        font: { color: "#49a81d", family: "Arial, Helvetica, sans-serif" }
    }; 
    
    Plotly.newPlot("bar", data, layout);  
    });
  } 
  // obtain metadata
  function updateMetadata(sample) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        var filterData = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = filterData[0];
        var panelBody = d3.select("#sample-metadata");

         panelBody.html("");

        Object.entries(result).forEach((key)=>{
            panelBody.append("p").text(key[0] + ":" + key[1]);
        })
    });
  }
  // Option Change Function
  function optionChanged(selectNew) {
    updateMetadata(selectNew);
    buildPlot(selectNew); 
  } 
  init();