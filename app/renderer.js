// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const remote = require('electron').remote; 
const app = require('electron').remote.app;
const dialog = require('electron').remote.dialog;
const fs = require('fs');
const song = require('brill-song');
const settings = require('electron-settings');

// global variables
var currentsong;
var is_song_open = false;

//
// internal functions
//
var init = function () {
    if (settings.has('songwriters')) {
	$("#brill-songwriters").val(settings.get('songwriters'));
    }
};

var get_songwriters = function () {
    if (settings.has('songwriters')) {
	return settings.get('songwriters');
    } else {
	return "";
    }
}

var update_data = function(val, route) {
    var routes = route.split(":");  
    currentsong.set(val, routes[0], routes[1]);
    currentsong.dump();
}
    
var render = function() {
    $(".brill-title").val(currentsong.get("title", "title"));
    $(".brill-songwriters").val(currentsong.get("songwriters", "songwriters"));
}

var show_song = function () {
    $('.brill-hidden').transition('fade');
}

//
// controls bindings
//

// semantic ui tabs
$('.tabular.menu .item').tab();

// bind data fields to update the song
$("input[data-brill]").change(function (e) {
    var val = $(e.target).val();
    var route = $(e.target).attr("data-brill");
    update_data(val, route);
});

// bind buttons and stuff
$('.ui.button.brill-open').click(function () {
    var home = app.getPath('home');
    dialog.showOpenDialog({properties: ['openDirectory', 'CreateDirectory'],
			   defaultPath: home},
			  function (fileName) {
			      if(fileName === undefined){
			      } else {
				  currentsong = song.open(fileName[0], get_songwriters());
				  show_song();
				  render();
				  $('.ui.modal.brillopen').modal('hide');
			      }
			  }
			  )});

$('.ui.button.brill-new').click(function () {
    var home = app.getPath('home');
    dialog.showSaveDialog({properties: ['openDirectory', 'CreateDirectory'],
			   defaultPath: home},
			  function (fileName) {
			      if(fileName === undefined){
				  console.log("No file selected");
			      } else {
				  var selectedsong = fileName;
				  fs.mkdir(selectedsong, function(err){
				      if (err) {
					  return console.error(err);
				      }
				      currentsong = song.open(selectedsong, get_songwriters());
				      show_song();
				      render(); 
				      $('.ui.modal.brillopen').modal('hide');

});
			      }
			  }
			  )});

$("#brill-save-songwriters").click(function () {
    var songwriters = $("#brill-songwriters").val();
    settings.set('songwriters', songwriters);
});

//
// now run init
//
init();

