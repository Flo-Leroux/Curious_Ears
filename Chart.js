class Chart {
	center = {
		x,
		y
	};

	radius;

	contructor(center, radius) {
		this.center.x = getReal(center.x);
		this.center.y = getReal(center.y);
		this.radius = getReal(radius);
	}

	draw() {
		var point = new Point(this.center.x, this.center.y);
		var circle = new Path.Circle(point, this.radius);
		myCircle.fillColor = 'black';
	}
}