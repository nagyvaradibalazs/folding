//the dataset containing the rectangle and lines
var data = [undefined, []];
var segments = [];

//function to retrieve the dataset
const getData = () => {
    return data;
};

//function to update the dataset
const updateData = (newData, pos = -1) => {
    data = [];
    data.push(newData[0])
    var lines = [];

    for(var i = 0; i < newData[1].length; i++) {
        if(i != pos) {
            lines.push(newData[1][i]);
        }
    }
    data.push(lines);
};

const getSegments = () => {
    return segments;
};

const updateSegments = (newSegments) => {
    segments = [];

    for(var i = 0; i < newSegments.length; i++) {
        segments.push(newSegments[i]);
    }
}

export { getData, updateData, getSegments, updateSegments };