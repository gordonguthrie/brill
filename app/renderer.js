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
    if (typeof(settings.get('songwriters')) !== undefined) {
	console.log("songwriters is " + settings.get('songwriters'));
	$("#brill-songwriters").val(settings.get('songwriters'));
    }
};

var render = function() {
    console.log(currentsong);
    currentsong.dump();
}

//
// controls bindings
//
$('.tabular.menu .item').tab();

//
// bind buttons and stuff
//
$('.ui.button.brill-open').click(function () {
    var home = app.getPath('home');
    dialog.showOpenDialog({properties: ['openDirectory', 'CreateDirectory'],
			   defaultPath: home},
			  function (fileName) {
			      if(fileName === undefined){
			      } else {
				  currentsong = song.open(fileName);
				  console.log(currentsong);
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
				      currentsong = song.open(selectedsong)
				      render();
				      $('.ui.modal.brillopen').modal('hide');

});
			      }
			  }
			  )});

$("#brill-save-songwriters").click(function () {
    console.log("save button clicked");
    if (is_song_open) {
	console.log(song);
	song.mark_dirty("songwriters");
    }
    var songwriters = $("#brill-songwriters").val();
    console.log("songwriters is " + songwriters);
    settings.set('songwriters', songwriters);
});

//
// now run init
//
init();
