exports.draw_swing_control = function (beats_to_bar, swing) {
    var canvas = document.getElementById("brill-swing-canvas");
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(10, 90, 600, 4);
    // now draw the defaults

    var diff = 400/beats_to_bar;
    var offset = 10;
    console.log(swing);
    for (var i = 0; i < beats_to_bar; i++) {
	ctx.fillRect((offset + i * diff),  80, 4, 10);
    };

    add_swing_beats(swing);
};

var on_swing_move = function (event) {
    console.log(e.target);
};

var add_swing_beats = function (swing) {
    // first add the beats
    for (s in swing) {
	//$(".draggable").draggable({containment: "#container", scroll: false, stop: function (e) { on_swing_move(e);}});
    };
};
