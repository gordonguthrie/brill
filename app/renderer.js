// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const remote = require('electron').remote;
const app = require('electron').remote.app;
const dialog = require('electron').remote.dialog;
const fs = require('fs');
const song = require('brill-song');
const settings = require('electron-settings');
const ipcRenderer = require('electron').ipcRenderer;
const swingRenderer = require('./swing.js');

// global variables
var currentsong;
var is_song_open = false;

//
// internal functions
//
var init_settings = function () {
    if (settings.has('songwriters')) {
	var songwriters = settings.get('songwriters');
	$("#brill-songwriters-setting").val(songwriters);
    };
    if (settings.has('songs_directory')) {
	var songs_dir = settings.get('songs_directory');
	$("#brill-songs-directory-setting").val(songs_dir);
    };
    if (settings.has('instruments_directory')) {
	var instruments_dir = settings.get('instruments_directory');
	$("#brill-instruments-directory-setting").val(instruments_dir);
    };
    if (settings.has('compile_on_update')) {
	var is_checked = settings.get('compile_on_update');
	$("#brill-compile-setting").prop('checked', is_checked);
    } else {
	$("#brill-compile-setting").prop('checked', true);
    };
    // lastly render
    render();
};

var is_empty = function (obj) {
    for (var key in obj) {
	if(obj.hasOwnProperty(key)) {
	    return false;
	};
    };
    return true;
};

var get_songwriters_from_settings = function () {
    if (settings.has('songwriters')) {
	return settings.get('songwriters');
    } else {
	return "";
    }
};

var get_songs_dir_from_settings = function () {
    if (settings.has('songs_directory')) {
	return settings.get('songs_directory');
    } else {
	var home = app.getPath('home');
	return home;
    }
};

var get_array_value = function(route) {
    var routes = route.split(":");
    return currentsong.arrayGet(routes[0], routes[1], routes[2]);
};

var get_value = function(route) {
    var routes = route.split(":");
    return currentsong.get(routes[0], routes[1]);
};

var get_whole_array = function(route) {
    var routes = route.split(":");
    return currentsong.getWholeArray(routes[0], routes[1]);
};

var update_data = function(val, route) {
    var routes = route.split(":");
    currentsong.set(val, routes[0], routes[1]);
    maybe_compile();
    render();
};

var render = function() {
    read_data_and_render();
    bind_fields_for_update();
    // progressively show stuff that has prerequisites to work
    if ($(".brill-beats_to_the_bar").val() !== undefined) {
	console.log("got beats to the bar");
	console.log($(".brill-beats_to_the_bar"));
	$("[data-hidden='beats_to_the_bar']").transition('fade');
	render_swing();
    };
};

var render_swing = function () {
    console.log("in render swing");
    var swing = get_whole_array("timing:swing");
    var is_obj_empty = is_empty(swing);
    // if there is no swing, create a default swing
    var beats_to_bar = parseInt(get_value("timing:beats_to_the_bar"), 10);
    if (is_obj_empty) {
	for (var i = 0; i < beats_to_bar; i++) {
	    var beatname = "beat" + (i + 1);
	    currentsong.arraySet("timing", "swing", beatname, 0);
	    currentsong.arraySet("timing", "emphasis", beatname, 0);
	};
	// read swing back
	swing = get_whole_array("timing:swing");
	console.log("got swing of " + swing);
    };
    swingRenderer.draw_swing_control(beats_to_bar, swing);
};


var read_data_and_render = function () {
    var values = $("input[data-route]");
    values.each(function (d) {
	var route = $(values[d]).attr("data-route");
	$(values[d]).val(get_value(route));
    });
};

var bind_fields_for_update = function () {
    // bind data fields to update the song
    $("input[data-route]").change(on_change);

    $("input[data-settings").change(function (e) {
	var type = $(e.target).attr("data-type");
	var val;
	if (type === "boolean") {
	    val = $(e.target).is(":checked");
	} else {
	    val = $(e.target).val();
	};
	var setting = $(e.target).attr("data-settings");
	settings.set(setting, val);
    });
};

var maybe_compile = function () {
    if ($("#brill-compile-setting").is(":checked")) {
	currentsong.compile();
    };
};

var is_type_valid = function(val, type) {
    console.log("in is type valid");
    var obj = new Object();
    if (type === "number") {
	if (parseInt(val, 10)) {
	    obj.is_valid = true;
	    obj.val = parseInt(val, 10);
	} else {
	    obj.is_valid = false;
	    obj.val = val;
	};
    } else {
	    obj.is_valid = true;
	    obj.val = val;
    }
    return obj;
};

var get_fieldname = function(classname) {
    var segs = classname.split("-");
    return segs[1];
};

var on_change = function (e) {
    var val = $(e.target).val();
    var type = $(e.target).attr("data-type");
    var returnval = is_type_valid(val, type);
    if (returnval.is_valid) {
	var route = $(e.target).attr("data-route");
	$(".brill-error-msg").removeClass("visible");
	$(".brill-error-msg").addClass("hidden");
	update_data(returnval.val, route);
    } else {
	var fieldname = get_fieldname($(e.target).attr("class"));
	var msg = "Field " + fieldname + " has value " + val +
	    " which is not of type " + type;
	$(".brill-error").text(msg);
	$(".brill-error-msg").removeClass("hidden");
	$(".brill-error-msg").addClass("visible");
    }
};

/*var on_select_change = function(value, text, e) {
    console.log("value is " + value);
    console.log("text is " + text);
    console.log(e);
}*/

//
// bindings semantic ui controls
//

// semantic ui tabs
$('.tabular.menu .item').tab();

// semantic ui dropdowns
//$(".brill-time-signature").dropdown('setting', 'onChange', on_select_change);

//
// bind brill gui controls
//

//
// handle menu updates
//
var enable_menu = function (id) {
    var payload = new Object();
    payload.type = "enable menu";
    payload.menu_id = id;
    ipcRenderer.send('asynchronous-message', payload);
};


//
// functions to handle interprocess communications
//
ipcRenderer.on('new', function(ev, data) {
    var home = app.getPath('home');
    var openFn = function (fileName) {
	if(fileName !== undefined){
	    var selectedsong = fileName;
	    fs.mkdir(selectedsong, function(err){
		if (err) {
		    return console.error(err);
		}
		var writers = get_songwriters_from_settings();
		currentsong = song.open(selectedsong, writers);
		enable_menu("brill-menu-title");
		enable_menu("brill-menu-timing");
		enable_menu("brill-menu-instruments");
		render();
		$('.ui.modal.brillopen').modal('hide');
		// pop the song
		$("#brill-main").load('./title.html', function () {render();});
	    });
	}
    };
    var songs_dir = get_songs_dir_from_settings();
    var properties = {properties: ['openDirectory', 'CreateDirectory'],
		      defaultPath: songs_dir};
    dialog.showSaveDialog(properties, openFn);
});

ipcRenderer.on('open', function(ev, data) {
    var openFn = function (fileName) {
	if(fileName !== undefined){
	    var writers = get_songwriters_from_settings();
	    currentsong = song.open(fileName[0], writers);
	    enable_menu("brill-menu-title");
	    enable_menu("brill-menu-timing");
	    enable_menu("brill-menu-instruments");
	    render();
	    $('.ui.modal.brillopen').modal('hide');
	    // pop the song
	    $("#brill-main").load('./title.html', function () {render();});
	}
    };
    var songs_dir = get_songs_dir_from_settings();
    var properties = {properties: ['openDirectory', 'CreateDirectory'],
		      defaultPath: songs_dir};
    dialog.showOpenDialog(properties, openFn);
});

ipcRenderer.on('settings', function(ev, data) {
    $("#brill-main").load('./settings.html', function () {init_settings();});
});

ipcRenderer.on('title', function(ev, data) {
    $("#brill-main").load('./title.html', function () {render();});
});

ipcRenderer.on('timing', function(ev, data) {
    $("#brill-main").load('./timing.html', function () {render();});
});

ipcRenderer.on('instruments', function(ev, data) {
    $("#brill-main").load('./instruments.html', function () {render();});
});


//
// now run init
//

//currentsong = song.open("/home/vagrant/Songs/Evie", "Gordo");
//enable_menu("brill-menu-title");
//enable_menu("brill-menu-timing");
//enable_menu("brill-menu-instruments");
