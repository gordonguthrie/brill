// don't access the data directly - use the functions

exports.make = function () {
    return class BrillShape {
	constructor(x, y, w, h, dragH, dragV, expandH, expandV,
		    objfill, moveFn) {
	    this.x = x || 0;
	    this.y = y || 0;
	    this.w = w || 1;
	    this.h = h || 1;
	    this.dragHorizontal   = dragH   || true;
	    this.dragVertival     = dragV   || true;
	    this.expandHorizontal = expandH || true;
	    this.expandVertival   = expandV || true;
	    this.fill = objfill || '#AAAA00';
	    this.onMove = moveFn
	};

	drawShape(canvas, canvasW, canvasH) {
//	    console.log("\ndrawShape ******");
//	    console.log(this);
//	    console.log(canvasW);
//	    console.log(canvasH);
	    canvas.fillStyle = this.fill;
	    var x = this.x * canvasW;
	    var y = this.y * canvasH;

//	    console.log("in shape:drawShape x is " + x + " and y is " + y);
//	    console.log("******\n");
	    canvas.fillRect(x, y, this.w, this.h);
	};

	contains(mx, my) {
//	    console.log("\nin contains ************");
//	    console.log("mx is " + mx + " and my is " + my);
//	    console.log("this.x is " + this.x + " this.y is " + this.y);
	    var does_contain = (this.x <= mx) && (this.x + this.w >= mx) &&
		(this.y <= my) && (this.y + this.h >= my);
//	    console.log("in contain gets " + does_contain);
//	    console.log("**********\n");
	    return does_contain;
	};

	onMove() {
	    console.log("in onMove for shape");
	    this.moveFn()
	};

	dump(msg) {
	    var headline = ": " + msg || "";
	    console.log("dumping shape" + headline);
	    console.log("x is " + this.x + " y is " + this.y);
	    console.log("w is " + this.w + " h is " + this.h);
	};
    };
};
