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

//function to get distance between point and line
const getDistance = (x, y, line) => {
	var x1 = line[0];
	var y1 = line[1];
	var x2 = line[2];
	var y2 = line[3];

	var a = y1 - y2;
	var b = x2 - x1;
	var c = -(y1 * (x2 - x1) + x1 * (y1 - y2)); 

	return Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b);
};

//function to get the angle of a corner
const getAngle = (pos, data) => {
	var rect = data[0];

	var lines = [[0, 0, 0, rect[3]], [rect[2], 0, rect[2], rect[3]]];

	for(var i = 0; i < data[1].length; i++) lines.push(data[1][i]);

	var x = pos[0];
	var y = pos[1];

	var limit = 25;

	//only one or no line
	if(!(0 < x && x < rect[2] && 0 < y && y < rect[3])) return -1;

	//finding two lines
	var min1 = Infinity;
	var min2 = Infinity;
	var place1 = 0;
	var place2 = 0;
	var d = 0;
	for(var i = 0; i < lines.length; i++) {
		d = getDistance(x, y, lines[i]);
		if(d < min2 && d >= min1) {
			min2 = d;
			place2 = i;
		}
		else if(d < min1) {
			min2 = min1;
			place2 = place1;
			min1 = d;
			place1 = i;
		}
	}

	//if the lines meet / or not
	if(min1 < limit && min2 < limit) {
		var m1 = (lines[place1][1] - lines[place1][3]) / (Math.max(lines[place1][2] - lines[place1][0], 0.0000000001));
		var m2 = (lines[place2][1] - lines[place2][3]) / (Math.max(lines[place2][2] - lines[place2][0], 0.0000000001));

		var value = Math.atan((m1 - m2) / (1 + m1 * m2)) * 180 / Math.PI;
		value *= 100;
		value = Math.round(value);
		value /= 100;
		value = Math.abs(value);

		return value;
	}
	return -1;
}

//function to handle drawing lines
const changeColor = (e, canvas, data, segments) => {
    var x = getClick(e, canvas)[0];
    var y = getClick(e, canvas)[1];

	var rect = data[0];
	var lines = data[1];

	var translate = [(canvas.width - rect[2]) / 2, canvas.height * 0.025];

	x -= translate[0];
	y -= translate[1];

	//lines
	if(0 <= x && x <= rect[2]) {
		for(var i = 0; i < lines.length; i++) {
			var lineY = lines[i][1] + (x - lines[i][0]) / (lines[i][2] - lines[i][0]) * (lines[i][3] - lines[i][1]);
			
			if(lineY - 10 <= y && y <= lineY + 5) {
				if(lines[i][4] == "#ff0000") lines[i][4] = "#0000ff";
				else lines[i][4] = "#ff0000";

				return [0, [rect, lines]];
			}
		}
	}

	//segments
	var xPlace;
	if(-3 <= x && x <= 3) xPlace = 0;
	else if(rect[2] - 3 <= x && x <= rect[2] + 3) xPlace = 1;
	else return [undefined, [x, y]];

	for(var i = 0; i < segments.length; i++) {
		if(segments[i][xPlace][1] <= y && y <= segments[i][xPlace][3]) {
			if(segments[i][xPlace][4] == "#ff0000") segments[i][xPlace][4] = "#0000ff";
			else segments[i][xPlace][4] = "#ff0000";

			return [1, segments];
		}
	}

	return [undefined, [x, y]];
};

//function to color based on miura pattern
const changeColorToMiura = (data, segments) => {
	var colors = ["#ff0000", "#0000ff"];
	var index = 0;

	for(var i = 0; i < data[1].length; i++) {
		data[1][i][4] = colors[index];
		index = 1 - index;
	}

	index = (data[1][0][1] < data[1][0][3]) ? 0 : 1;

	for(var i = 0; i < segments.length; i++) {
		segments[i][0][4] = colors[index];
		segments[i][1][4] = colors[1 - index];
		index = 1 - index;
	}

	return [data, segments];
};

//function to color based on yoshimura pattern
const changeColorToYoshimura = (data, segments) => {
	var colors = ["#ff0000", "#0000ff"];
	
	console.log(data);
	console.log(segments);

	for(var i = 0; i < data[1].length; i++) {
		data[1][i][4] = colors[0];
	}

	for(var i = 0; i < segments.length; i++) {
		segments[i][0][4] = colors[1];
		segments[i][1][4] = colors[1];
	}

	return [data, segments];
};

//function to generate doc elements of lines
const generateLineUpdater = (idOfMain, idOfTargets, fullData, remove) => {
	var main = document.getElementById(idOfMain);
	var target1 = document.getElementById(idOfTargets[0]);
	var target2 = document.getElementById(idOfTargets[1]);
	
	//data parameter renaming - it is kinda stupid
	var data = fullData[1];
	var multiplier = fullData[0][4];
	var height = fullData[0][3];

	main.innerHTML = "";
	main.appendChild(target1);
	main.appendChild(target2);

	for(var i = 0; i < data.length; i++) {
		var newElement = document.createElement("div");
		newElement.setAttribute("id", `line${i + 1}`);
		newElement.innerHTML = `Line ${i + 1}: <div class="lineElement"><input type="number" id="left${i + 1}" value="${Math.round((height / multiplier - data[i][1] / multiplier) * 10) / 10}" step=".1" style="width: 80px"><input type="number" id="right${i + 1}" value="${Math.round((height / multiplier - data[i][3] / multiplier) * 10) / 10}" step=".1" style="width: 80px"><input type="button" class="del" id="${i + 1}" value="X"></div>`;

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
	var aRgbHex = hex.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];
    return aRgb;
};

//function to create the tessellation SVG
const makeTessellation = (svg, data, segments, repeats, mirror, offsetVertical) => {
	if(data[0] == undefined) return 0;
	if(repeats <= 1) repeats = 1;
	
	svg.innerHTML = "";

	var multiplier = 1 / data[0][4];
	multiplier *= 72 / 25.4;

	offsetVertical *= multiplier;
	offsetVertical *= data[0][4];

	var offset = 10;

	var startingIndex = 0;
	var offsetX = offset;
	var offsetY = offset;

	if(offsetVertical < 0) offsetY -= repeats * offsetVertical;

	for(var i = 0; i <= repeats; i++) {
		for(var j = 0; j < segments.length; j++) {
			var colour = convert(segments[j][startingIndex][4]);
			svg.innerHTML += `<line x1="${segments[j][startingIndex][0] * multiplier + offsetX}" y1="${segments[j][startingIndex][1] * multiplier + offsetY}" x2="${segments[j][startingIndex][2] * multiplier + offsetX}" y2="${segments[j][startingIndex][3] * multiplier + offsetY}" style="stroke:rgb(${colour[0]}, ${colour[1]}, ${colour[2]});stroke-width:1" />`;
		}

		if(mirror || i == repeats - 1) startingIndex = 1 - startingIndex;

		if(mirror) offsetX = offset + (Math.floor((i + 1) / 2) * 2) * data[0][2] * multiplier;
		else offsetX = offset + (i + 1) * data[0][2] * multiplier;
		if(i == repeats - 1 && !mirror) offsetX -= data[0][2] * multiplier;

		offsetY += offsetVertical;
	}

	startingIndex = 0;
	offsetX = offset;
	offsetY = offset;

	if(offsetVertical < 0) offsetY -= repeats * offsetVertical;

	for(var i = 0; i < repeats; i++) {
		for(var j = 0; j < segments.length - 1; j++) {
			var colour = convert(data[1][j][4]);
			svg.innerHTML += `<line x1="${segments[j][0][2] * multiplier + offsetX}" y1="${segments[j][startingIndex][3] * multiplier + offsetY}" x2="${segments[j][1][2] * multiplier + offsetX}" y2="${segments[j][1 - startingIndex][3] * multiplier + offsetY}" style="stroke:rgb(${colour[0]}, ${colour[1]}, ${colour[2]});stroke-width:1" />`;
		}

		if(mirror) startingIndex = 1 - startingIndex;

		offsetX = offset + (i + 1) * data[0][2] * multiplier;

		offsetY += offsetVertical;
	}

	offsetX = offset;
	offsetY = offset;

	if(offsetVertical < 0) offsetY -= repeats * offsetVertical;

	svg.innerHTML += `<line x1="${offsetX}" y1="${offsetY}" x2="${repeats * data[0][2] * multiplier + offsetX}" y2="${offsetY + repeats * offsetVertical}" style="stroke:rgb(0,0,0);stroke-width:1" />`;
	svg.innerHTML += `<line x1="${offsetX}" y1="${offsetY + data[0][3] * multiplier}" x2="${repeats * data[0][2] * multiplier + offsetX}" y2="${offsetY + data[0][3] * multiplier + repeats * offsetVertical}" style="stroke:rgb(0,0,0);stroke-width:1" />`;
};

export { onSubmit, generateLineUpdater, getAngle, onUpdate, makeTessellation, changeColor, changeColorToMiura, changeColorToYoshimura };