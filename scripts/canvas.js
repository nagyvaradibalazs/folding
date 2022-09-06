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
		drawLineToCanvas(ctx, ...line, translate[0], translate[1], 3);
	}
};

//function to display the relevant angle on the canvas
const displayAngle = async (canvas, data, segments, angle, pos) => {
	var ctx = canvas.getContext("2d");

	var rect = data[0];
	var translate = [(canvas.width - rect[2]) / 2, canvas.height * 0.025];

	ctx.font="100 15px Garamond";
	ctx.fillStyle = "#000000";
	
	if(angle != -1)
		ctx.fillText(`${angle}°/${180 - angle}°`, pos[0] + translate[0], pos[1] + translate[1]);

	await new Promise(resolve => setTimeout(resolve, 2000));

	renderCanvas(canvas, data, segments);
};

//function to render the profile curve
const renderCurve = (canvas, lines) => {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0, canvas.width, canvas.height);

	var ratio = 0.8

	var end1 = [lines[0][0], lines[0][1]];
	var end2 = [lines[lines.length - 1][2], lines[lines.length - 1][3]];

	if(lines.length >= 2) {
		for(var i = 0; i < 5; i++) {
			var tempLines = [];
			for(var j = 1; j < lines.length; j++) {
				// line 1
				var diffX = lines[j - 1][2] - lines[j - 1][0];
				var diffY = lines[j - 1][3] - lines[j - 1][1];
				var line1 = [lines[j - 1][0] + diffX * (1 - ratio), lines[j - 1][1] + diffY * (1 - ratio), lines[j - 1][0] + diffX * ratio, lines[j - 1][1] + diffY * ratio];

				//line 2
				diffX = lines[j][2] - lines[j][0];
				diffY = lines[j][3] - lines[j][1];
				var line2 = [lines[j][2] - diffX * ratio, lines[j][3] - diffY * ratio, lines[j][2] - diffX * (1 - ratio), lines[j][3] - diffY * (1 - ratio)];

				//connecting
				var connecting = [line1[2], line1[3], line2[0], line2[1]];

				//adding
				tempLines.push(line1);
				tempLines.push(connecting);
				tempLines.push(line2);
			}

			lines.length = 0;

			for(var j = 0; j < tempLines.length; j++) {
				lines.push(tempLines[j]);
			}
		}
	}

	lines.push([...end1, lines[0][0], lines[0][1]]);
	lines.push([...end2, lines[lines.length - 2][2], lines[lines.length - 2][3]]);

	for(var i = 0; i < lines.length; i++) {
		drawLineToCanvas(ctx, ...lines[i], "#ff0000", 0, 0, 5, 1);
	}
};

//function to generate the folded profile
const renderProfile = (canvas, canvas2, data) => {
	var ctx = canvas.getContext("2d");
	var segments = data[0];

	var multiplier = canvas.height * 0.98 / (document.getElementById("draw").height * 0.95);

	var diffX = (data[1][2] - data[1][0]) * multiplier;
	var diffY = (data[1][3] - data[1][1]) * multiplier;

	multiplier *= canvas.height / Math.max(diffX, diffY) * 0.98;

	var translate = [-data[1][0] * multiplier + (canvas.height - (data[1][2] - data[1][0]) * multiplier) / 2, -data[1][1] * multiplier + (canvas.height - (data[1][3] - data[1][1]) * multiplier) / 2];

	var lines = [];

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

		lines.push([
			(segments[i][0][0] + segments[i][1][0]) / 2 * multiplier + translate[0],
			(segments[i][0][1] + segments[i][1][1]) / 2 * multiplier + translate[1],
			(segments[i][0][2] + segments[i][1][2]) / 2 * multiplier + translate[0],
			(segments[i][0][3] + segments[i][1][3]) / 2 * multiplier + translate[1],
		]);
	}
	renderCurve(canvas2, lines);
};

export { renderCanvas, displayAngle, renderProfile };