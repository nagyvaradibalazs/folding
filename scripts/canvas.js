//function to draw a line onto a ctx;
const drawLineToCanvas = (ctx, x1, y1, x2, y2, color = "#000000", translateX = 0, translateY = 0, width = 1, multiplier = 1) => {
	x1 *= multiplier, y1 *= multiplier, x2 *= multiplier, y2 *= multiplier;
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(x1 + translateX, y1 + translateY);
	ctx.lineTo(x2 + translateX, y2 + translateY);
	ctx.strokeStyle = color;
	ctx.stroke();
};

//function to render canvas
const renderCanvas = (canvas, data, segments) => {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0, canvas.width, canvas.height);

	var rect = data[0];
	var lines = data[1];
	
	//scaling
	var multiplier = rect[4];

	//translate
	var translate = [(canvas.width - rect[2]) / 2, canvas.height * 0.025];

	//rectangle
	drawLineToCanvas(ctx, rect[0], rect[1], rect[0] + rect[2], rect[1], "#000000", translate[0], translate[1], 3);
	drawLineToCanvas(ctx, rect[0] + rect[2], rect[1] + rect[3], rect[0], rect[1] + rect[3], "#000000", translate[0], translate[1], 3);

	for(var i = 0; i < segments.length; i++) {
		drawLineToCanvas(ctx, ...segments[i][0], translate[0], translate[1], 3);
		drawLineToCanvas(ctx, ...segments[i][1], translate[0], translate[1], 3);
	}

	//lines
	for(var i = 0; i < lines.length; i++) {
		var line = lines[i];
		//console.log(line);
		drawLineToCanvas(ctx, ...line, translate[0], translate[1], 3);
	}
};

//function to generate the folded profile
const renderProfile = (canvas, data) => {
	var ctx = canvas.getContext("2d");
	var segments = data[0];

	var multiplier = 400 / (860 * 0.95);

	var diffX = (data[1][2] - data[1][0]) * multiplier;
	var diffY = (data[1][3] - data[1][1]) * multiplier;
	var translate = [-data[1][0] * multiplier + (canvas.width - diffX) / 2, -data[1][1] * multiplier + (canvas.height - diffY) / 2];

	//console.log([diffX, diffY, translate[0], translate[1]]);

	//console.log(data[1]);

	ctx.clearRect(0,0, canvas.width, canvas.height);
	drawLineToCanvas(ctx, segments[0][0][0], segments[0][0][1], segments[0][1][0], segments[0][1][1], "#000000", translate[0], translate[1], 1, multiplier);

	for(var i = 0; i < segments.length; i++) {
		var mirror = [segments[i][0][2], segments[i][0][3], segments[i][1][2], segments[i][1][3]];
		
		drawLineToCanvas(ctx, segments[i][0][0], segments[i][0][1], segments[i][0][2], segments[i][0][3], "#000000", translate[0], translate[1], 1, multiplier);
		drawLineToCanvas(ctx, segments[i][1][0], segments[i][1][1], segments[i][1][2], segments[i][1][3], "#000000", translate[0], translate[1], 1, multiplier);
		drawLineToCanvas(ctx, ...mirror, "#000000", translate[0], translate[1], 1, multiplier);
		drawLineToCanvas(ctx,
			(segments[i][0][0] + segments[i][1][0]) / 2,
			(segments[i][0][1] + segments[i][1][1]) / 2,
			(segments[i][0][2] + segments[i][1][2]) / 2,
			(segments[i][0][3] + segments[i][1][3]) / 2, 
			"#ff0000", translate[0], translate[1], 3, multiplier
		);
	}
};

export { renderCanvas, /*drawCircle,*/ renderProfile };