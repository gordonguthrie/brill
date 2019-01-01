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

// global variables
var currentsong;
var is_song_open = false;

//
// internal functions
//
var init = function () {
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
    var values = $("input[data-route]");
    values.each(function (d) {
	var route = $(values[d]).attr("data-route");
	$(values[d]).val(get_value(route));
    });
    // progressively show stuff that has prerequisites to work
    if ($(".brill-beats_to_the_bar").val() !== "") {
	$("[data-hidden='beats_to_the_bar']").transition('fade');
	render_swing();
    };
};

var render_swing = function () {
    var swing = get_whole_array("swing:swing");
    var is_obj_empty = is_empty(swing);
    if (is_empty) {
	var no_of_notes = parseInt(get_value("timing:beats_to_the_bar"), 10);
	for (var i = 0; i < no_of_notes; i++) {
	    var beatname = "beat" + (i + 1);
	    currentsong.add("swing", beatname);
	    currentsong.arraySet(0, "swing", beatname, "swing");
	    currentsong.arraySet(0, "swing", beatname, "emphasis");
	};
    } else {
	console.log("got swing");
    };
};

var maybe_compile = function () {
    console.log("maybe compiling");
    if ($("#brill-compile-setting").is(":checked")) {
	currentsong.compile();
    };
};

var is_type_valid = function(val, type) {
    if (type === "number") {
	if (parseInt(val, 10)) {
	    return true
	} else {
	    return false
	};
    } else {
	return true;
    }
};

var get_fieldname = function(classname) {
    var segs = classname.split("-");
    return segs[1];
};

var on_change = function (e) {
    var val = $(e.target).val();
    var type = $(e.target).attr("data-type");
    if (is_type_valid(val, type)) {
	var route = $(e.target).attr("data-route");
	$(".brill-error-msg").removeClass("visible");
	$(".brill-error-msg").addClass("hidden");
	update_data(val, route);
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
    console.log("about to send an aync message");
    var payload = new Object();
    payload.type = "enable menu";
    payload.menu_id = id;
    console.log(payload);
    ipcRenderer.send('asynchronous-message', payload);
};

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
		console.log(currentsong);
		enable_menu("brill-menu-title");
		render();
		$('.ui.modal.brillopen').modal('hide');
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
	    render();
	    $('.ui.modal.brillopen').modal('hide');
	}
    };
    var songs_dir = get_songs_dir_from_settings();
    var properties = {properties: ['openDirectory', 'CreateDirectory'],
		      defaultPath: songs_dir};
    dialog.showOpenDialog(properties, openFn);
});

ipcRenderer.on('settings', function(ev, data) {
    console.log("in settings");
});

ipcRenderer.on('title', function(ev, data) {
    $("#brill-main").load('./title.html');
});

ipcRenderer.on('timing', function(ev, data) {
    console.log("in timing");
});

ipcRenderer.on('instruments', function(ev, data) {
    console.log("in instruments");
});


//
// now run init
//
init();

currentsong = song.open("/home/vagrant/Songs/Evie", "Gordo");
enable_menu("brill-menu-title");
render();
