//function to draw a line onto a ctx;
const drawLineToCanvas = (ctx, x1, y1, x2, y2, color = "#000000", translateX = 0, translateY = 0) => {
	ctx.beginPath();
	ctx.moveTo(x1 + translateX, y1 + translateY);
	ctx.lineTo(x2 + translateX, y2 + translateY, 6);
	ctx.strokeStyle = color;
	ctx.stroke();
};

//function to render canvas
const renderCanvas = (canvas, data) => {
	var ctx = canvas.getContext("2d");

	var rect = data[0];
	var lines = data[1];
	
	//translate
	var translate = [(canvas.width - rect[2]) / 2, 0];

	//rectangle
	ctx.clearRect(0,0, canvas.width, canvas.height);
	drawLineToCanvas(ctx, rect[0], rect[1], rect[0] + rect[2], rect[1], "#000000", translate[0], translate[1]);
	drawLineToCanvas(ctx, rect[0] + rect[2], rect[1], rect[0] + rect[2], rect[1] + rect[3], "#000000", translate[0], translate[1]);
	drawLineToCanvas(ctx, rect[0] + rect[2], rect[1] + rect[3], rect[0], rect[1] + rect[3], "#000000", translate[0], translate[1]);
	drawLineToCanvas(ctx, rect[0], rect[1] + rect[3], rect[0], rect[1], "#000000", translate[0], translate[1]);
	
	//lines
	for(var i = 0; i < lines.length; i++) {
		var line = lines[i];
		drawLineToCanvas(ctx, ...line, "#000000", translate[0], translate[1]);
	}
};

//function to draw circles
/*const drawCircle = (canvas, x, y) => {
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#ff0000";
	ctx.beginPath();
	ctx.arc(x, y, 3, 0, 2 * Math.PI);
	ctx.fill();
};*/

//function to generate the folded profile
const renderProfile = (canvas, data) => {
	var ctx = canvas.getContext("2d");
	var segments = data[0];

	var diffX = data[1][2] - data[1][0];
	var diffY = data[1][3] - data[1][1];
	var translate = [-data[1][0] + (canvas.width - diffX) / 2, -data[1][1] + (canvas.height - diffY) / 2];

	//console.log([diffX, diffY, translate[0], translate[1]]);

	//console.log(data[1]);

	ctx.clearRect(0,0, canvas.width, canvas.height);
	drawLineToCanvas(ctx, segments[0][0][0], segments[0][0][1], segments[0][1][0], segments[0][1][1], "#000000", translate[0], translate[1]);

	for(var i = 0; i < segments.length; i++) {
		var mirror = [segments[i][0][2], segments[i][0][3], segments[i][1][2], segments[i][1][3]];
		
		drawLineToCanvas(ctx, ...segments[i][0], "#000000", translate[0], translate[1]);
		drawLineToCanvas(ctx, ...segments[i][1], "#000000", translate[0], translate[1]);
		drawLineToCanvas(ctx, ...mirror, "#000000", translate[0], translate[1]);
		drawLineToCanvas(ctx,
			(segments[i][0][0] + segments[i][1][0]) / 2,
			(segments[i][0][1] + segments[i][1][1]) / 2,
			(segments[i][0][2] + segments[i][1][2]) / 2,
			(segments[i][0][3] + segments[i][1][3]) / 2, 
			"#ff0000", translate[0], translate[1]
		);
	}
};

export { renderCanvas, /*drawCircle,*/ renderProfile };