var bellybuttonData;

// initialize the data
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
    // Grab values from the json object to build the plots
    d3.json("data/samples.json").then((data) => {
    var samples = data.samples;
    // var personData = data.samples;
    var filterData = samples.filter(sampleObject => sampleObject.id == sample);
    // var filterData = samples.filter(sampleObject => sampleObject.id == personData);
    var result = filterData[0];
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    // console.log(result);
    // console.log(sample_values);
    // console.log(otu_ids);
    // console.log(otu_labels);   
    
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
     // get the top 10 OTUs in each individual
    var sample_values_10 = result.sample_values.slice(0, 10).reverse();
    // console.log(sample_values_10);
    // get only top 10 otu ids for the plot OTU and reversing it. 
    var OTU = (result.otu_ids.slice(0, 10)).reverse();
    // get the otu id's to the desired form for the plot
    var OTU_id = OTU.map(d => "OTU " + d)
    // console.log(OTU_id);
    //  get corresponding top 10 labels for each OTU
    var labels = result.otu_labels.slice(0, 10).reverse();
    // console.log(labels);

    // create data variable for trace layout
    var data = [trace1];
    var layout = {
        showlegend: false,
        autorange: true,
        hovermode: 'closest',
        xaxis: {title:"OTU ID"},
        margin: {t:20}
    };
    // passing in graph data to render bubble plot
    Plotly.newPlot('bubble', data, layout); 
    var trace1 = {
        x: sample_values_10,
        y: OTU_id,
        text: labels,
        type: "bar",
        orientation: "h"
    };
    // create data variable for bar chart
    var data = [trace1];
    var layout = {
        title: "Top Ten OTU's " +sample,
        margin: {l: 100, r: 100, t: 100, b: 100},
        font: { color: "#49a81d", family: "Arial, Helvetica, sans-serif" }
    }; 
    // passing in graph data to render bar plot
    Plotly.newPlot("bar", data, layout);  
    });
  } 
  // function to obtain metadata
  function updateMetadata(sample) {
    d3.json("data/samples.json").then((data) => {
        // obtain Demographic Info for panel
        var metadata = data.metadata;
        var filterData = metadata.filter(sampleObject => sampleObject.id == sample);
        // console.log(filterData);
        var result = filterData[0];
        // console.log(result);
        var panelBody = d3.select("#sample-metadata");

         // remove any children from the list before refreshing with new data
         panelBody.html("");

        // append Demographic Info for panel
        Object.entries(result).forEach((key)=>{
            panelBody.append("p").text(key[0] + ":" + key[1]);
        })
    });
  } 
  init();