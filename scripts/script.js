//import * as saveSvgAsPng from 'save-svg-as-png';

import * as Canvas from "./canvas.js";
import * as Data from "./data.js";
import * as Handle from "./handle.js";
import * as Preprocess from "./preprocess.js";

//function to remove lines
const removeLine = (button) => {
	var oldData = Data.getData();
	Data.updateData([oldData[0], oldData[1]], button.id - 1);
	var tempData = Data.getData();

	Canvas.renderCanvas(mainCanvas, tempData);
	Handle.generateLineUpdater("lines", ["add", "update"], Data.getData()[1], removeLine);

	//generateProfile(document.getElementById("profile"), itemsOnCanvas);
	var segments = Preprocess.createSegments(tempData);
	Canvas.renderProfile(profile, segments);
};

//declare doc elements and adding event listeners
const mainCanvas = document.getElementById("draw");
const sbmt = document.getElementById("submit");
const addLine = document.getElementById("add");
const update = document.getElementById("update");
const profile = document.getElementById("profile");
const makeTessellation = document.getElementById("makeTessellation");
const svgDocument = document.getElementById("svg");
const download = document.getElementById("download");

sbmt.addEventListener("click", e => {
	Data.updateData(Handle.onSubmit(mainCanvas));

	var tempData = Data.getData();
	Canvas.renderCanvas(mainCanvas, tempData);
	Handle.generateLineUpdater("lines", ["add", "update"], tempData[1], removeLine);

	//generateProfile(document.getElementById("profile"), itemsOnCanvas);
	var segments = Preprocess.createSegments(tempData);
	Canvas.renderProfile(profile, segments);
});

/*mainCanvas.addEventListener("click", e => {
	if(Data.getData()[0] == undefined) {alert("You have to define the strip first!");}
	else {
		var clicks = Handle.onLineDraw(e, mainCanvas);
		if(clicks.length == 2) {
			Canvas.drawCircle(mainCanvas, clicks[0], clicks[1]);
		} else {
			var oldData = Data.getData();			
			Data.updateData(Preprocess.updateLines(oldData, clicks));

			var tempData = Data.getData();
			Canvas.renderCanvas(mainCanvas, tempData);
			Handle.generateLineUpdater("lines", "update", tempData[1], removeLine);

			//generateProfile(document.getElementById("profile"), itemsOnCanvas);
			var segments = Preprocess.createSegments(tempData);
			Canvas.renderProfile(profile, segments);
		}
	}
}, false);*/

addLine.addEventListener("click", e => {
	if(Data.getData()[0] == undefined) {alert("You have to define the strip first!");}
	else {
		var oldData = Data.getData();
		var width = oldData[0][2];
		oldData[1].push([0, 0, width, 0]);

		var tempData = Data.getData();
		Handle.generateLineUpdater("lines", ["add", "update"], tempData[1], removeLine);
		//console.log(tempData);
	}
}, false);

update.addEventListener("click", e => {
	var oldData = Data.getData();
	var newLines = Handle.onUpdate(oldData);
	var newData = [oldData[0], Preprocess.sortUpdatedLines(newLines)];
	Data.updateData(newData);

	var tempData = Data.getData();
	Canvas.renderCanvas(mainCanvas, tempData);
	Handle.generateLineUpdater("lines", ["add", "update"], tempData[1], removeLine);
	
	//generateProfile(document.getElementById("profile"), itemsOnCanvas);
	var segments = Preprocess.createSegments(tempData);
	//console.log(segments);
	Canvas.renderProfile(profile, segments);
	//console.log(tempData);
});

makeTessellation.addEventListener("click", e => {
	var tempData = Data.getData();
	var repeats = parseInt(document.getElementById("repeats").value);

	var segments = Preprocess.createSegments(tempData, 1);
	Handle.makeTessellation(svgDocument, tempData, segments, repeats);

	//offering download
	download.setAttribute("href", `data:image/svg+xml;utf8,<svg width="${800}" height="${800}" xmlns="http://www.w3.org/2000/svg">${svg.innerHTML}</svg>`);

	/*var svgSource = svg.outerHTML;
	var svgDataUri = "data:image/svg+xml;base64," + btoa(svgSource);
	var link = download;
	link.setAttribute('href', svgDataUri);*/
});

/*download.addEventListener("click", e => {
	saveSvgAsPng.saveSvg(svg, "tessellation");
});*/