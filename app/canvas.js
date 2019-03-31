exports.make = function () {
    return class BrillCanvass {
	constructor(canvas) {

	    var ctx = canvas.getContext('2d');
	    ctx.fillStyle = "#AA0000";

	    this.canvas = canvas;
	    this.ctx = ctx;
	    this.shapes = [];
	    this.dragoffx = 0;
	    this.dragoffy = 0;

	    // get some layout stuff
	    var stylePaddingLeft, stylePaddingTop
	    var styleBorderLeft, styleBorderTop;

	    var getComputedStyle = function(style) {
		var s = document.defaultView.getComputedStyle(canvas, null)[style];
		return parseInt(s, 10) || 0;
	    };

	    var adj = {};
	    adj.stylePaddingLeft = 0;
	    adj.stylePaddingTop  = 0;
	    adj.styleBorderLeft  = 0;
	    adj.styleBorderTop   = 0;

	    if (document.defaultView && document.defaultView.getComputedStyle) {
		adj.stylePaddingLeft = getComputedStyle('paddingLeft');
		adj.stylePaddingTop  = getComputedStyle('paddingTop');
		adj.styleBorderLeft  = getComputedStyle('borderLeftWidth');
		adj.styleBorderTop   = getComputedStyle('borderTopWidth');
	    }
	    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
	    // They will mess up mouse coordinates and this fixes that
	    var html = document.body.parentNode;
	    adj.htmlTop  = html.offsetTop;
	    adj.htmlLeft = html.offsetLeft;
	    this.adjustments = adj;
	};

	init() {

	    var canv = this.canvas;
	    var adj = this.adjustments;
	    var shps = this.shapes;

	    console.log("in init");
	    console.log(this.canvas);

	    this.canvas.addEventListener('selectstart', function (e) {
		e.preventDefault(); return false;
	    }, false);

	    this.canvas.addEventListener('mousedown', function (e) {
		var mouse = getMouse(canv, adj, e);
		var mx = mouse.x;
		var my = mouse.y;
		for (var i = shps.length - 1; i >= 0; i--) {
		    console.log("mx is " + mx + " and my is " + my);
		    if (shps[i].contains(mx, my)) {
			console.log("clicked in shape " + i);
		    } else {
			console.log("didn't click in a shape");
		    };
		};
	    });
	};

	addShapes(newshapes) {
	    for (var i = 0; i < newshapes.length; i++) {
		this.shapes.push(newshapes[i]);
	    };
	};

	draw() {
	    for (var i = 0; i < this.shapes.length; i++) {
		this.shapes[i].drawShape(this.ctx);
	    };
	};
    };
};


var getMouse = function (canvas, adj, e) {

    var element = canvas;
    var offsetX = 0;
    var offsetY = 0;
    var mx, my;

    console.log(canvas);
    console.log(adj);
    console.log(e);

    console.log("element is " + element);

    // Compute the total offset
    if (element.offsetParent !== undefined) {
	do {
	    offsetX += element.offsetLeft;
	    offsetY += element.offsetTop;
	} while ((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += adj.stylePaddingLeft + adj.styleBorderLeft + adj.htmlLeft;
    offsetY += adj.stylePaddingTop  + adj.styleBorderTop  + adj.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    // We return a simple javascript object (a hash) with x and y defined
    return {x: mx, y: my};
}
