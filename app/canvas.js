exports.make = function () {
    return class BrillCanvass {
	constructor(canvas) {

	    var ctx = canvas.getContext('2d');
	    ctx.fillStyle = "#AA0000";

	    this.canvas = canvas;
	    this.width = $(canvas).width();
	    this.height = $(canvas).height();
	    this.ctx = ctx;
	    this.shapes = [];

	    // parameters for dragging things
	    this.dragoffx = 0;
	    this.dragoffy = 0;
	    this.dragging = false;
	    this.selection = null;

	    // the redraw interval
	    this.redrawinterval = 30;
	    this.dirtyfordrawing = true;

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
	    // Some pages have fixed-position bars (like the stumbleupon bar)
	    // at the top or left of the page
	    // They will mess up mouse coordinates and this fixes that
	    var html = document.body.parentNode;
	    adj.htmlTop  = html.offsetTop;
	    adj.htmlLeft = html.offsetLeft;

	    // wrap them in a object to make function calls clearer
	    this.adjustments = adj;

	};

	init() {

	    // get some variables that point to this for use
	    // in closures
	    var canv    = this.canvas;
	    var context = this.ctx
	    var adj     = this.adjustments;
	    var shps    = this.shapes;
	    var d4d     = this.dirtyfordrawing
	    var sel     = this.selection;
	    var width   = this.width;
	    var height  = this.height;

	    //
	    // set up the events
	    //

	    this.canvas.addEventListener('selectstart', function (e) {
		e.preventDefault(); return false;
	    }, false);

	    this.canvas.addEventListener('mousedown', function (e) {
		var mouse = getMouse(canv, adj, e);
		var mx = mouse.x;
		var my = mouse.y;
		for (var i = shps.length - 1; i >= 0; i--) {
		    if (shps[i].contains(mx/width, my/height)) {
			sel = shps[i];
			canv.dragoffx = mx - sel.x;
			canv.dragoffy = my - sel.y;
			canv.dragging = true;
			sel.onMove(sel);
			canv.selection = sel;
			d4d = true;
		    };
		};
	    }, true);

	    this.canvas.addEventListener('mousemove', function (e) {
		if (canv.dragging) {
		    var mouse = getMouse(canv, adj, e);
		    canv.selection.x = mouse.x - canv.dragoffx;
		    canv.selection.y = mouse.y - canv.dragoffy;
		    d4d = true;
		};
	    }, false);

	    this.canvas.addEventListener('mouseup', function (e) {
		canv.dragging = false;
		d4d = true;
	    }, true);

	    // we redraw based on an ticking time interval
	    var draw = function () {
		// first clear it all
		if (d4d) {
		    context.clearRect(0, 0, canv.width, canv.height);
		    for (var i = 0; i < shps.length; i++) {
//			console.log("about to draw shape with context");
//			console.log("width is " + width + " height is " + height);
			shps[i].drawShape(context, width, height);
		    };
		    d4d = false;
		};
	    };

	    setInterval(function () {draw();}, this.redrawinterval);

	};

	addShapes(newshapes) {
	    for (var i = 0; i < newshapes.length; i++) {
		this.shapes.push(newshapes[i]);
	    };
	    this.dirtyfordrawing = true;
	};

    };
};


var getMouse = function (canvas, adj, e) {

    var element = canvas;
    var offsetX = 0;
    var offsetY = 0;
    var mx, my;

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
