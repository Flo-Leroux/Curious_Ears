
var canvas;
var original_size, actual_ratio, last_width;
var trigoCircle, listen;

var chart;

with(Math) {
    trigoCircle = [
        [0, 1],
        [1/2, sqrt(3)/2],
        [sqrt(3)/2, 1/2],
        [1, 0],
        [sqrt(3)/2, -1/2],
        [1/2, -sqrt(3)/2],
        [0, -1],
        [-1/2, -sqrt(3)/2],
        [-sqrt(3)/2, -1/2],
        [-1, 0],
        [-sqrt(3)/2, 1/2],
        [-1/2, sqrt(3)/2]
    ];
}

listen = [
    70.98972336,
    38.54596978,
    78.51562328,
    33.40830006,
    22.26479929/*, 
    66.31250841,
    57.04290894,
    89.13390786,
    78.84897795,
    60.44050702,
    43.8293792,
    55.6542152 */
];

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

window.onload = function() {
	// Get a reference to the canvas object
	canvas = document.getElementById('myCanvas');
	// Create an empty project and a view for the canvas:
	paper.setup(canvas);
	init();
	// Create a Paper.js Path to draw a line into it:
	chart = new RadarChart(paper.view.center, getReal(400), listen);
	paper.view.draw();
}

function init() {
	original_size = {
		width: 1000,
		height: 1000
	};

	actual_ratio = paper.view.viewSize.width/original_size.width;
	last_width = paper.view.viewSize.width;
}

function getReal(val) {
	var actual_ratio = paper.view.viewSize.width/original_size.width;
	return val*actual_ratio;
}

function getScale() {
	var scale = paper.view.viewSize.width/last_width;
	last_width = paper.view.viewSize.width;
	return scale;
}

window.onresize = function() {
	paper.view.setViewSize(getReal(original_size.width), getReal(original_size.height));
	var scale = getScale();
	actual_ratio = paper.view.viewSize.width/original_size.width;

	chart.update(paper.view.center, scale, getReal(400));
	// t.position = new Point(getReal(600), getReal(300));
	// t.scale(scale);	
}

class RadarChart {

	constructor(position, radius, values) {
		this.position = position;
		this.radius = radius;
		this.values =this.scaleValues(values);
		this.angle = 2*Math.PI/this.values.length;
		
		this.circles = [];
		this.circles.push(this.circle(this.position, this.radius, 'fill', 'black'));
		this.circles.push(this.circle(this.position, this.radius/3, 'stroke', 'white'));
		this.circles.push(this.circle(this.position, this.radius/3*2, 'stroke', 'white'));

		var res = this.axes(this.position, this.radius, 'white');
		this.axes = res[0];
		this.vectors = res[1];

		var res = this.points(this.position, 4, 'red');
		this.maxValues = res[0]; 
		this.maxPath = res[1]; 
		this.path = this.linkPoints();
	}

	circle(position, radius, type='stroke', color='black') {
		var draw = new paper.Path.Circle(position, radius);
		if(type==='fill') {
			draw.fillColor = color;				
		}
		else {
			draw.strokeColor = color;	
		}
		return draw;
	}
	
	axes(position, radius, color) {
		var X, Y;
		var axes = [];
		var vectors = [];
		var points = [];
		var i=0;
		var start = position;

		var endX = position.x;
		var endY = position.y - radius;
		var end = new paper.Point(endX, endY);
		var axe = new paper.Path.Line(start, end);
		var vector = {x: end.x-start.x, y: end.y-start.y};

		axe.strokeColor = color;
		axes.push(axe);
		vectors.push(vector);
		
		while(i<this.values.length-1) {
			X = endX - position.x;
			Y = endY - position.y;
			endX = position.x + X*Math.cos(this.angle) - Y*Math.sin(this.angle);
			endY = position.y + X*Math.sin(this.angle) + Y*Math.cos(this.angle);
			end = new paper.Point(endX, endY);
			axe = new paper.Path.Line(start, end);
			vector = {x: end.x-start.x, y: end.y-start.y};
			
			axe.strokeColor = color
			axes.push(axe);
			vectors.push(vector);
			i++;
		}
		return [axes, vectors];	
	}

	points(position, radius, color) {
		var X, Y;
		var i=0;
		var pointsOfValues = [];
		var pointsOfPath = [];

		var pointX, pointY, pointPosition, point;

		while(i<this.values.length) {
			pointX = position.x + this.values[i]*Math.cos(this.angle*(i-this.values.length/4));
			pointY = position.y + this.values[i]*Math.sin(this.angle*(i-this.values.length/4));
			pointPosition = new paper.Point(pointX, pointY);
			point = new paper.Path.Circle(pointPosition, radius);
			point.fillColor = color;

			pointsOfValues.push(pointPosition);
			pointsOfPath.push(point);
			i++;
		}
		return [pointsOfValues, pointsOfPath];
	}

	linkPoints() {
		this.copy = [];
		var path = new paper.Path();
		
		var i=0;
		while(i<this.maxValues.length) {
			path.add(this.maxValues[i]);
			i++;
		}
		
		path.strokeColor = 'lightgreen';
		path.strokeWidth = 2;
		path.closed = true;
		path.smooth({ type: 'catmull-rom' });
		// path.flatten(2);

		for(var i=1; i<12; i++) {
			var copy = path.clone();
			copy.scale(1/12*i);
			// copy.strokeColor = '';
			copy.fillColor = 'rgba(0, 0, 255, 0.2)';
			this.copy.push(copy);
		}

		return path;
	}

	scaleValues(values) {
		var max = values.max();
		return values.map(value => {
			return this.radius/max*value;
		});
	}

	update(position, scale, radiusReel) {
		var i=0;
		while(i<this.circles.length) {
			this.circles[i].position = position;
			this.circles[i].scale(scale);
			i++;
		}

		var i=0;
		while(i<this.axes.length) {
			this.axes[i].scale(scale);
	
			this.axes[i].position.x = position.x + this.vectors[i].x - this.vectors[i].x/2 ;
			this.axes[i].position.y = position.y + this.vectors[i].y - this.vectors[i].y/2;
	
			this.vectors[i].x = this.axes[i].segments[1].point.x - this.axes[i].segments[0].point.x;
			this.vectors[i].y = this.axes[i].segments[1].point.y - this.axes[i].segments[0].point.y;
			i++;
		}

		var i=0;
		this.radius = radiusReel;
		this.values = this.scaleValues(this.values);
		while(i<this.maxPath.length) {
			this.maxPath[i].position.x = position.x + this.values[i]*Math.cos(this.angle*(i-this.values.length/4));
			this.maxPath[i].position.y = position.y + this.values[i]*Math.sin(this.angle*(i-this.values.length/4));

			this.maxValues[i].x = position.x + this.values[i]*Math.cos(this.angle*(i-this.values.length/4));
			this.maxValues[i].y = position.y + this.values[i]*Math.sin(this.angle*(i-this.values.length/4));
			i++;
		}

		this.path.scale(scale);
		this.path.remove();
		
		for(var i=0; i<this.copy.length; i++) {
			this.copy[i].remove();
		}
		this.path = this.linkPoints();
	}
}