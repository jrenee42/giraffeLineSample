import './App.css';

import React, { useState } from 'react';
import {Plot} from '@influxdata/giraffe';


 const buttonStyle={
	marginTop: 12,
	color:'black',
	backgroundColor:'cyan'
 };

//note:  the text-align:center on the entire app made the graph contents be offset from the grid.
function App() {
    const [tableData, setTableData] = useState(null);
    
    function getNewData(){
	const link = 'http://localhost:3000/giraffe_influxData';
	console.log('inside get new data....');

	const requestOptions = {
            method: 'POST'
	};

	fetch(link,requestOptions)
	    .then(res => res.text())
	    .then(result => { 
		//console.log('got stuff?', result);
		setTableData(result);
	    },
	  (error) => {
	      console.log("got error :(", error);
	  });
    } //end getNewData

    const graphStyle = {
        width: "calc(70vw - 20px)",
        height: "calc(70vh - 20px)",
        margin: "40px auto",
    };

    const findStringColumns = (table) =>   table.columnKeys.filter(k => table.getColumnType(k) === 'string');

    const lineLayer = {
	type: "line",
	x: "_time",
	y: "_value"
    };

    let giraffeTable = null;

    if (tableData){

	const config = {
	    
	    fluxResponse: tableData,
	    layers: [lineLayer]
	};

	giraffeTable  = <div style={graphStyle} ><Plot config={config}/></div>;
    }

    return (
	    <div className="App">
	    <header className="App-header">
	    <button style={buttonStyle} onClick={getNewData}> fetch data </button>
	    </header>
	    {giraffeTable}
	</div>
    );
}

export default App;
