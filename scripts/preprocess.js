//sorting function
const mySort = (x, y) => {
	if(x[1] < y[1]) return -1;
	if(x[1] > y[1]) return 1;
	return 0;
};

//function to mirror a point onto a line
const mirrorPoint = (mirror, x, y) => {
	var m = (mirror[3] - mirror[1]) / (mirror[2] - mirror[0]);
	var b = mirror[3] - m * mirror[2];
	
	var rotateM = -1 / m;
	var rotateB = y - rotateM * x;
	
	var intersectX = (rotateB - b) / (m - rotateM);
	var intersectY = m * intersectX + b;
	
	var diffToIntersectX = x - intersectX;
	var diffToIntersectY = y - intersectY;
	
	return [x - 2 * diffToIntersectX, y - 2 * diffToIntersectY];
};

//function to sort updated lines
const sortUpdatedLines = (data) => {
	var result = data;
	result.sort(mySort);
	return result;
};

//function to create segments of strip partition
const createSegments = (data, stop = 0) => {
	var rect = data[0];
	var lines = data[1];

	var segments = [];
	
	var prevPoint1 = [rect[0], rect[1]];
	var prevPoint2 = [rect[0] + rect[2], rect[1]];
	var nextPoint1, nextPoint2, segmentLeft, segmentRight;

	var minX = 0, minY = 0, maxX = 0, maxY = 0;
	
	for(var i = 0; i <= lines.length; i++) {
		if(i == lines.length) { 
			nextPoint1 = [rect[0], rect[1] + rect[3]];
			nextPoint2 = [rect[0] + rect[2], rect[1] + rect[3]];
		}
		else {
			nextPoint1 = [lines[i][0], lines[i][1]];
			nextPoint2 = [lines[i][2], lines[i][3]];
		}
		
		segmentLeft = [prevPoint1[0], prevPoint1[1], nextPoint1[0], nextPoint1[1], "#47515b"];
		segmentRight = [prevPoint2[0], prevPoint2[1], nextPoint2[0], nextPoint2[1], "#47515b"];

		prevPoint1 = nextPoint1;
		prevPoint2 = nextPoint2;

		if(segmentLeft[3] - segmentLeft[1] < 0) {
			prevPoint1[1] = segmentLeft[1];
		}

		if(segmentRight[3] - segmentRight[1] < 0) {
			prevPoint2[1] = segmentRight[1];
		}
		
		if(!((segmentLeft[0] == 0 && segmentLeft[1] == 0 && segmentLeft[2] == 0 && segmentLeft[3] == 0) || 
			(segmentRight[0] == rect[2] && segmentRight[1] == rect[3] && segmentRight[2] == rect[2] && segmentRight[3] == rect[3]) ||
			(segmentLeft[0] == NaN && segmentLeft[1] == NaN && segmentLeft[2] == NaN && segmentLeft[3] == NaN) || 
			(segmentRight[0] == NaN && segmentRight[1] == NaN && segmentRight[2] == NaN && segmentRight[3] == NaN) ||
			(segmentLeft[3] - segmentLeft[1] < 0) || (segmentRight[3] - segmentRight[1] < 0)) ||
			(segmentLeft[0] == 0 && segmentLeft[1] == 0 && segmentLeft[2] == 0 && segmentLeft[3] == 0) || 
			(segmentRight[0] == rect[2] && segmentRight[1] == rect[3] && segmentRight[2] == rect[2] && segmentRight[3] == rect[3])) {

			segments.push([segmentLeft, segmentRight]);
		}
	}

	//console.log(segments);

	if(stop == 1) return segments;

	for(var i = 0; i < segments.length; i++) {
		var mirror = [segments[i][0][2], segments[i][0][3], segments[i][1][2], segments[i][1][3]];
				
		minX = Math.min(minX, segments[i][0][0], segments[i][0][2], segments[i][1][0], segments[i][1][2]);
		minY = Math.min(minY, segments[i][0][1], segments[i][0][3], segments[i][1][1], segments[i][1][3]);
		maxX = Math.max(maxX, segments[i][0][0], segments[i][0][2], segments[i][1][0], segments[i][1][2]);
		maxY = Math.max(maxY, segments[i][0][1], segments[i][0][3], segments[i][1][1], segments[i][1][3]);

		for(var j = i + 1; j < segments.length; j++) {
			var newPoint1 = mirrorPoint(mirror, segments[j][0][0], segments[j][0][1]);
			var newPoint2 = mirrorPoint(mirror, segments[j][0][2], segments[j][0][3]);
			var newPoint3 = mirrorPoint(mirror, segments[j][1][0], segments[j][1][1]);
			var newPoint4 = mirrorPoint(mirror, segments[j][1][2], segments[j][1][3]);
			
			segments[j] = [[newPoint1[0], newPoint1[1], newPoint2[0], newPoint2[1]], [newPoint3[0], newPoint3[1], newPoint4[0], newPoint4[1]]];
		}
	}

	return [segments, [minX, minY, maxX, maxY]];
};

export { sortUpdatedLines, createSegments };