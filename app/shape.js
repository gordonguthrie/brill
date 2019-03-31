exports.make = function () {
    return class BrillShape {
	constructor(x, y, w, h, dragH, dragV, expandH, expandV, objfill) {
	    this.x = x || 0;
	    this.y = y || 0;
	    this.w = w || 1;
	    this.h = h || 1;
	    this.dragHorizontal   = dragH   || true;
	    this.dragVertival     = dragV   || true;
	    this.expandHorizontal = expandH || true;
	    this.expandVertival   = expandV || true;
	    this.fill = objfill || '#AAAA00';
	};

	drawShape(canvas) {
	    canvas.fillStyle = this.fill;
	    canvas.fillRect(this.x, this.y, this.w, this.h);
	};

	contains(mx, my) {
	    return  (this.x <= mx) && (this.x + this.w >= mx) &&
		(this.y <= my) && (this.y + this.h >= my);
	};

	dump(msg) {
	    var headline = ": " + msg || "";
	    console.log("dumping shape" + headline);
	    console.log("x is " + this.x + " y is " + this.y);
	    console.log("w is " + this.w + " h is " + this.h);
	};
    };
};
