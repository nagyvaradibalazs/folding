import * as Canvas from "./canvas.js";
import * as Data from "./data.js";
import * as Handle from "./handle.js";
import * as Preprocess from "./preprocess.js";

//function to remove lines
const removeLine = (button) => {
	var oldData = Data.getData();
	Data.updateData([oldData[0], oldData[1]], button.id - 1);
	var tempData = Data.getData();

	//Canvas.renderCanvas(mainCanvas, tempData);
	Handle.generateLineUpdater("lines", ["add", "update"], Data.getData(), removeLine);

	//generateProfile(document.getElementById("profile"), itemsOnCanvas);
	var segments = Preprocess.createSegments(tempData);
	var segmentsForCanvas = Preprocess.createSegments(tempData, 1);
	Canvas.renderProfile(profile, curve, segments);
	Canvas.renderCanvas(mainCanvas, tempData, segmentsForCanvas);

	Data.updateSegments(segmentsForCanvas);
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
const curve = document.getElementById("curve");
const repeatsInput = document.getElementById("repeats");
const mirrorInput = document.getElementById("mirror");
const offsetInput = document.getElementById("offset");
const miura = document.getElementById("miura");
const yoshimura = document.getElementById("yoshimura");

sbmt.addEventListener("click", e => {
	Data.updateData(Handle.onSubmit(mainCanvas));

	var tempData = Data.getData();
	//console.log(tempData);
	//Canvas.renderCanvas(mainCanvas, tempData);
	Handle.generateLineUpdater("lines", ["add", "update"], tempData, removeLine);

	//generateProfile(document.getElementById("profile"), itemsOnCanvas);
	var segments = Preprocess.createSegments(tempData);
	var segmentsForCanvas = Preprocess.createSegments(tempData, 1);
	Data.updateSegments(segmentsForCanvas);

	Canvas.renderProfile(profile, curve, segments);
	Canvas.renderCanvas(mainCanvas, tempData, segmentsForCanvas);
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
		oldData[1].push([0, oldData[0][3], width, oldData[0][3], "#47515b"]);

		var tempData = Data.getData();
		Handle.generateLineUpdater("lines", ["add", "update"], tempData, removeLine);
		//console.log(tempData);
	}
}, false);

update.addEventListener("click", e => {
	var oldData = Data.getData();
	var newLines = Handle.onUpdate(oldData);
	var newData = [oldData[0], Preprocess.sortUpdatedLines(newLines)];
	Data.updateData(newData);

	var tempData = Data.getData();
	
	Handle.generateLineUpdater("lines", ["add", "update"], tempData, removeLine);
	//console.log(tempData);
	//generateProfile(document.getElementById("profile"), itemsOnCanvas);
	var segments = Preprocess.createSegments(tempData);
	var segmentsForCanvas = Preprocess.createSegments(tempData, 1);
	Canvas.renderProfile(profile, curve, segments);
	Canvas.renderCanvas(mainCanvas, tempData, segmentsForCanvas);
	//console.log(tempData);
	Data.updateSegments(segmentsForCanvas);
	//console.log(tempData);
	//console.log(segmentsForCanvas);
});

makeTessellation.addEventListener("click", e => {
	var tempData = Data.getData();
	var repeats = parseInt(repeatsInput.value);

	var height = tempData[0][3] / tempData[0][4];
	var width = tempData[0][2] / tempData[0][4] * repeats;

	var ratio = 400 / height;

	var multiplier = 72 / 25.4;

	svgDocument.style.height = 400;
	svgDocument.style.width = width * ratio;	

	svgDocument.setAttribute("viewBox", `0 0 ${width * multiplier + 20} ${height * multiplier + 20}`);

	var segments = Data.getSegments();
	Handle.makeTessellation(svgDocument, tempData, segments, repeats, mirrorInput.checked, offsetInput.value * 1.0);

	//offering download
	download.setAttribute("href", `data:image/svg+xml;utf8,<svg width="${width * multiplier + 20}" height="${height * multiplier + 20}" xmlns="http://www.w3.org/2000/svg">${svg.innerHTML}</svg>`);
});

mainCanvas.addEventListener("click", e => {
	var tempData = Data.getData();
	var oldSegments = Data.getSegments();
	//console.log(oldSegments);
	var result = Handle.changeColor(e, mainCanvas, tempData, oldSegments);

	//console.log(result);

	if(result[0] == undefined) {
		var angle = Handle.getAngle(result[1], tempData);
		Canvas.displayAngle(mainCanvas, tempData, oldSegments, angle, result[1]);
		return 0;
	};

	if(result[0] == 0) {
		//console.log("lines");
		Data.updateData(result[1]);
	} else {
		//console.log("segments");
		Data.updateSegments(result[1]);
	}

	var newData = Data.getData();
	var newSegmentsForCanvas = Data.getSegments();
	Canvas.renderCanvas(mainCanvas, newData, newSegmentsForCanvas);
});

miura.addEventListener("click", e => {
	var tempData = Data.getData();
	var oldSegments = Data.getSegments();
	var result = Handle.changeColorToMiura(tempData, oldSegments);

	Data.updateData(result[0]);
	Data.updateSegments(result[1]);
	var newData = Data.getData();
	var newSegmentsForCanvas = Data.getSegments();
	Canvas.renderCanvas(mainCanvas, newData, newSegmentsForCanvas);
});

yoshimura.addEventListener("click", e => {
	var tempData = Data.getData();
	var oldSegments = Data.getSegments();
	var result = Handle.changeColorToYoshimura(tempData, oldSegments);

	Data.updateData(result[0]);
	Data.updateSegments(result[1]);
	var newData = Data.getData();
	var newSegmentsForCanvas = Data.getSegments();
	Canvas.renderCanvas(mainCanvas, newData, newSegmentsForCanvas);
});