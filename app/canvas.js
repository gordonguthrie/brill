exports.make = function () {
    return class BrillCanvass {
	constructor(canvas) {
	    this.canvas = canvas;
	    this.shapes = [];
	};

	addShapes(newshapes) {
	    for (var i = 0; i < newshapes.length; i++) {
		this.shapes.push(newshapes[i]);
	    };
	};

	draw() {
	    for (var i = 0; i < this.shapes.length; i++) {
		this.shapes[i].drawShape(this.canvas);
	    };
	};
    };
};
