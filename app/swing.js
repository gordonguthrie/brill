const canvas = require("./canvas");
const shape = require("./shape");

var Canvas = canvas.make();
var Shape = shape.make();

const canvas_width = 400;

exports.draw_swing_control = function (beats_to_bar, swing) {
    var canvas = document.getElementById("brill-swing-markers");
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(10, 10, 600, 4);
    // now draw the defaults

    for (var i = 0; i < beats_to_bar; i++) {
	var x_pos = make_x_pos(i, beats_to_bar, 0);
	ctx.fillRect(x_pos, 0, 4, 10);
    };

    add_swing_beats(swing, beats_to_bar);
};

var on_swing_move = function (event) {
    console.log(e.target);
};

var add_swing_beats = function (swing, beats_to_bar) {
    // first add the beats
    var canvas = document.getElementById("brill-swing-canvas");
    var shapes = [];
    var key, i, cv;
    for (i = 0; i < swing.length; i++) {
	key = Object.keys(swing[i])[0];
	make_beat(shapes, i, beats_to_bar, swing[i][key]);
    };
    cv = new Canvas(canvas);
    cv.init();
    cv.addShapes(shapes);
};

// need to do this to avoid variable hoist
var make_beat = function (array, index, beats_to_bar, key) {
    var x_pos = make_x_pos(index, beats_to_bar, key);
    var s = makeBeat(x_pos, 0, 4 ,10);
    array.push(s);
};

var make_x_pos = function (index, beats_to_bar, swing) {
    offset = 10;
    diff = canvas_width/beats_to_bar;
    return offset + index*diff + swing;
};

var makeBeat = function (x, y, w, h) {
    return new Shape(x, y, w, h, '#AAAA00', true, false, false, true);
};
