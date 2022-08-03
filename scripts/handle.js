//internal variables
//var clicks = 0
//var lastClick = [];

//import { sortUpdatedLines } from "./preprocess.js";

//function to handle click of submit button
const onSubmit = (canvas) => {
	var height = document.getElementById("height").value * 1.0;
	var width = document.getElementById("width").value * 1.0;

	/*var ratio = width / height;
	height = canvas.height * 0.9;
	width = height * ratio;*/
	var multiplier = canvas.height * 0.95 / height;

	return [[0, 0, width * multiplier, height * multiplier, multiplier],[]];
};

//function to get clicks on main canvas
const getClick = (e, canvas) => {
	let rect = canvas.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;
	
	return [x, y];
};

//function to handle drawing lines
const changeColor = (e, canvas, data, segments) => {
    var x = getClick(e, canvas)[0];
    var y = getClick(e, canvas)[1];

	var rect = data[0];
	var lines = data[1];

	var translate = [(canvas.width - rect[2]) / 2, canvas.height * 0.025];

	x -= translate[0];
	y -= translate[1];
	//console.log(x);
	//console.log(y);

    /*if(clicks != 1) {
        clicks++;
        lastClick = [x, y];
        return [x, y];
    } else {
        clicks = 0;
        var result = [lastClick[0], lastClick[1], x, y];
        lastClick = [x, y];
        return result;
    }*/

	//lines
	if(0 <= x && x <= rect[2]) {
		//console.log("yeah");
		for(var i = 0; i < lines.length; i++) {
			var lineY = lines[i][1] + (x - lines[i][0]) / (lines[i][2] - lines[i][0]) * (lines[i][3] - lines[i][1]);
			//console.log(lineY);
			if(lineY - 3 <= y && y <= lineY + 10) {
				if(lines[i][4] == "#ff0000") lines[i][4] = "#0000ff";
				else lines[i][4] = "#ff0000";

				return [0, [rect, lines]];
			}
		}
	}

	//segments
	var xPlace;
	if(-1 <= x && x <= 5) xPlace = 0;
	else if(rect[2] - 1 <= x && x <= rect[2] + 5) xPlace = 1;
	else return undefined;

	//console.log(xPlace);
	//console.log(segments);

	for(var i = 0; i < segments.length; i++) {
		//console.log(xPlace);
		if(segments[i][xPlace][1] <= y && y <= segments[i][xPlace][3]) {
			if(segments[i][xPlace][4] == "#ff0000") segments[i][xPlace][4] = "#0000ff";
			else segments[i][xPlace][4] = "#ff0000";

			return [1, segments];
		}
	}

	return undefined;
};

//function to generate doc elements of lines
const generateLineUpdater = (idOfMain, idOfTargets, fullData, remove) => {
	var main = document.getElementById(idOfMain);
	var target1 = document.getElementById(idOfTargets[0]);
	var target2 = document.getElementById(idOfTargets[1]);
	
	//data parameter renaming - it is kinda retarded
	var data = fullData[1];
	var multiplier = fullData[0][4];
	var height = fullData[0][3];

	//console.log(fullData);

	main.innerHTML = "";
	main.appendChild(target1);
	main.appendChild(target2);

	for(var i = 0; i < data.length; i++) {
		var newElement = document.createElement("div");
		newElement.setAttribute("id", `line${i + 1}`);
		newElement.innerHTML = `Line ${i + 1}: <div style="margin-bottom: 10px;"><input type="number" id="left${i + 1}" value="${height / multiplier - data[i][1] / multiplier }" step=".1" style="width: 80px"><input type="number" id="right${i + 1}" value="${height / multiplier - data[i][3] / multiplier}" step=".1" style="width: 80px"><input type="button" class="del" id="${i + 1}" value="X"></div>`;

		main.insertBefore(newElement, target1);

        document.getElementById(`${i + 1}`).onclick = function() {remove(this);};
    }
};

//function to update position of the lines
const onUpdate = (data) => {
    var result = [];
	var multiplier = data[0][4];

	for(var i = 0; i < data[1].length; i++) {
		var newY1 = data[0][3] - document.getElementById(`left${i + 1}`).value * multiplier;
		var newY2 = data[0][3] - document.getElementById(`right${i + 1}`).value * multiplier;
		result.push([data[1][i][0], newY1, data[1][i][2], newY2, data[1][i][4]]);
	}
	
	return result;
};

//function to convert hex to rgb
const convert = (hex) => {
	hex = hex.slice(1);
	//console.log(hex);
	var aRgbHex = hex.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];
    return aRgb;
};

//function to create the tessellation SVG
const makeTessellation = (svg, data, segments, repeats) => {
	if(data[0] == undefined) return 0;
	if(repeats <= 1) repeats = 1;
	
	svg.innerHTML = "";

	var startingIndex = 0;
	var offset = 10;
	var offsetX = offset;
	var offsetY = 10;

	var multiplier = 1 / data[0][4];

	for(var i = 0; i <= repeats; i++) {
		for(var j = 0; j < segments.length; j++) {
			//console.log(offsetX);
			var colour = convert(segments[j][startingIndex][4]);
			//console.log(colour);
			svg.innerHTML += `<line x1="${segments[j][startingIndex][0] * multiplier + offsetX}" y1="${segments[j][startingIndex][1] * multiplier + offsetY}" x2="${segments[j][startingIndex][2] * multiplier + offsetX}" y2="${segments[j][startingIndex][3] * multiplier + offsetY}" style="stroke:rgb(${colour[0]}, ${colour[1]}, ${colour[2]});stroke-width:1" />`;
		}
		startingIndex = 1 - startingIndex;
		offsetX = offset + (Math.floor((i + 1) / 2) * 2) * data[0][2] * multiplier;
	}

	startingIndex = 0;
	offset = 10;
	offsetX = offset;

	for(var i = 0; i < repeats; i++) {
		for(var j = 0; j < segments.length - 1; j++) {
			//console.log(offsetX);
			var colour = convert(data[1][j][4]);
			//console.log(colour);
			svg.innerHTML += `<line x1="${segments[j][0][2] * multiplier + offsetX}" y1="${segments[j][startingIndex][3] * multiplier + offsetY}" x2="${segments[j][1][2] * multiplier + offsetX}" y2="${segments[j][1 - startingIndex][3] * multiplier + offsetY}" style="stroke:rgb(${colour[0]}, ${colour[1]}, ${colour[2]});stroke-width:1" />`;
			//svg.innerHTML += `<line x1="${segments[j][0][2] + offsetX}" y1="${segments[j][0][3] + offsetY}" x2="${segments[j][1][2] + offsetX}" y2="${segments[j][1][3] + offsetY}" style="stroke:rgb(0,0,0);stroke-width:1" />`;
		}
		startingIndex = 1 - startingIndex;
		offsetX = offset + (i + 1) * data[0][2] * multiplier;
	}

	svg.innerHTML += `<line x1="${offset}" y1="${offsetY}" x2="${repeats * data[0][2] * multiplier + offset}" y2="${offsetY}" style="stroke:rgb(0,0,0);stroke-width:1" />`;
	svg.innerHTML += `<line x1="${offset}" y1="${offsetY + data[0][3] * multiplier}" x2="${repeats * data[0][2] * multiplier + offset}" y2="${offsetY + data[0][3] * multiplier}" style="stroke:rgb(0,0,0);stroke-width:1" />`;
};

export { onSubmit, generateLineUpdater, onUpdate, makeTessellation, changeColor };