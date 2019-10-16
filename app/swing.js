const canvas = require("./canvas");
const shape = require("./shape");

var Canvas = canvas.make();
var Shape = shape.make();

exports.draw_swing_control = function (beats_to_bar, swing) {
    var canvas = document.getElementById("brill-swing-markers");
    var ctx = canvas.getContext('2d');
    var unit = $(canvas).width()/beats_to_bar;
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(0, 10, 600, 4);
    // now draw the defaults

    for (var i = 0; i < beats_to_bar; i++) {
	var x_pos = i * unit;
	ctx.fillRect(x_pos, 0, 4, 10);
    };

    add_swing_beats(swing, beats_to_bar);
};

var add_swing_beats = function (swing, beats_to_bar) {
    // first add the beats
    var canvas = document.getElementById("brill-swing-canvas");
    var shapes = [];
    var key, i, cv;
    // create the canvas so we have access to it dimensions
    cv = new Canvas(canvas);
    cv.init();
    for (i = 0; i < swing.length; i++) {
	key = Object.keys(swing[i].value)[0];
	make_beat(shapes, i, 1/beats_to_bar,
		  swing[i].value[1], swing[i].update_fn);
    };
    cv.addShapes(shapes);
};

// need to do this to avoid variable hoist
var make_beat = function (array, index, unit, key, update_fn) {
    var x_pos = index * unit;
    var s = makeBeat(x_pos, 0.7, 4 ,10, update_fn);
    array.push(s);
};

var makeBeat = function (x, y, w, h, update_fn) {
    var moveFn = function (value) {update_fn(value);};
    return new Shape(x, y, w, h, '#AAAA00', true, false, false, true, moveFn);
};
