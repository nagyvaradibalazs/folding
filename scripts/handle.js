//internal variables
var clicks = 0
var lastClick = [];

//function to handle click of submit button
const onSubmit = (canvas) => {
	var height = document.getElementById("height").value;
	var width = document.getElementById("width").value;

	var ratio = width / height;
	height = canvas.height;
	width = height * ratio;

	return [[0, 0, width, height],[]];
};

//function to get clicks on main canvas
/*const getClick = (e, canvas) => {
	let rect = canvas.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;
	
	return [x, y];
};*/

//function to handle drawing lines
/*const onLineDraw = (e, canvas) => {
    var x = getClick(e, canvas)[0];
    var y = getClick(e, canvas)[1];

    if(clicks != 1) {
        clicks++;
        lastClick = [x, y];
        return [x, y];
    } else {
        clicks = 0;
        var result = [lastClick[0], lastClick[1], x, y];
        lastClick = [x, y];
        return result;
    }
};*/

//function to generate doc elements of lines
const generateLineUpdater = (idOfMain, idOfTargets, data, remove) => {
	var main = document.getElementById(idOfMain);
	var target1 = document.getElementById(idOfTargets[0]);
	var target2 = document.getElementById(idOfTargets[1]);
	
	main.innerHTML = "";
	main.appendChild(target1);
	main.appendChild(target2);

	for(var i = 0; i < data.length; i++) {
		var newElement = document.createElement("div");
		newElement.setAttribute("id", `line${i + 1}`);
		newElement.innerHTML = `Line ${i + 1}: <input type="number" id="left${i + 1}" value="${data[i][1]}" style="width: 80px"><input type="number" id="right${i + 1}" value="${data[i][3]}" style="width: 80px"><input type="button" class="del" id="${i + 1}" value="X">`;

		main.insertBefore(newElement, target1);

        document.getElementById(`${i + 1}`).onclick = function() {remove(this);};
    }
};

//function to update position of the lines
const onUpdate = (data) => {
    var result = [];
	
	for(var i = 0; i < data[1].length; i++) {
		var newY1 = parseInt(document.getElementById(`left${i + 1}`).value);
		var newY2 = parseInt(document.getElementById(`right${i + 1}`).value);
		result.push([data[1][i][0], newY1, data[1][i][2], newY2]);
	}
	
	return result;
};

const makeTessellation = (svg, data, segments, repeats) => {
	if(data[0] == undefined) return 0;
	if(repeats <= 1) repeats = 1;
	
	svg.innerHTML = "";

	var startingIndex = 0;
	var offset = 50;
	var offsetX = offset;
	var offsetY = 0;

	for(var i = 0; i <= repeats; i++) {
		for(var j = 0; j < segments.length; j++) {
			//console.log(offsetX);
			svg.innerHTML += `<line x1="${segments[j][startingIndex][0] + offsetX}" y1="${segments[j][startingIndex][1] + offsetY}" x2="${segments[j][startingIndex][2] + offsetX}" y2="${segments[j][startingIndex][3] + offsetY}" style="stroke:rgb(0,0,0);stroke-width:1" />`;
		}
		startingIndex = 1 - startingIndex;
		offsetX = offset + (Math.floor((i + 1) / 2) * 2) * data[0][2];
	}

	startingIndex = 0;
	offset = 50;
	offsetX = offset;

	for(var i = 0; i < repeats; i++) {
		for(var j = 0; j < segments.length - 1; j++) {
			//console.log(offsetX);
			svg.innerHTML += `<line x1="${segments[j][0][2] + offsetX}" y1="${segments[j][startingIndex][3] + offsetY}" x2="${segments[j][1][2] + offsetX}" y2="${segments[j][1 - startingIndex][3] + offsetY}" style="stroke:rgb(0,0,0);stroke-width:1" />`;
			//svg.innerHTML += `<line x1="${segments[j][0][2] + offsetX}" y1="${segments[j][0][3] + offsetY}" x2="${segments[j][1][2] + offsetX}" y2="${segments[j][1][3] + offsetY}" style="stroke:rgb(0,0,0);stroke-width:1" />`;
		}
		startingIndex = 1 - startingIndex;
		offsetX = offset + (i + 1) * data[0][2];
	}

	svg.innerHTML += `<line x1="${offset}" y1="${offsetY}" x2="${repeats * data[0][2] + offset}" y2="${offsetY}" style="stroke:rgb(0,0,0);stroke-width:1" />`;
	svg.innerHTML += `<line x1="${offset}" y1="${offsetY + data[0][3]}" x2="${repeats * data[0][2] + offset}" y2="${offsetY + data[0][3]}" style="stroke:rgb(0,0,0);stroke-width:1" />`;
};

export { onSubmit, generateLineUpdater, onUpdate, makeTessellation };