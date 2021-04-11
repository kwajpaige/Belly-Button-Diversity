var bellybuttonData;

// initialize the data
function init(){
    // populate the dropdown
    var dropdownMenu = d3.select("#selDataset");
   // Fetch the JSON data
    d3.json("data/samples.json").then((data) =>{
        bellybuttonData = data;
        var subjectID = data.names;
        subjectID.forEach((ID) => {
            dropdownMenu.append('option').text(ID).property('value', ID);
        });
         // promise pending
        const selectID = subjectID[0];
        buildPlot(selectID);
        updateMetadata(selectID);
        // console.log(subjectID);
    });
}


  
  init();