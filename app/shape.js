exports.make = function () {
    return class BrillShape {
	constructor(x, y, w, h, dragH, dragV, expandH, expandV, objfill) {
	    this.x_coord = x || 0;
	    this.y_coord = y || 0;
	    this.width   = w || 1;
	    this.height  = h || 1;
	    this.dragHorizontal   = dragH   || true;
	    this.dragVertival     = dragV   || true;
	    this.expandHorizontal = expandH || true;
	    this.expandVertival   = expandV || true;
	    this.fill = objfill || '#AAAA00';
	};

	drawShape(canvas) {
	    canvas.fillStyle = this.fill;
	    canvas.fillRect(this.x_coord, this.y_coord, this.width, this.height);
	};

	contains(mx, my) {
	    return  (this.x_coord <= mx) && (this.x_coord + this.width >= mx) &&
		(this.y_coord <= my) && (this.y_coord + this.height >= my);
	};

	dump(msg) {
	    var headline = ": " + msg || "";
	    console.log("dumping shape" + headline);
	    console.log("x is " + this.x_coord + " y is " + this.y_coord);
	    console.log("w is " + this.width + " h is " + this.height);
	};
    };
};
