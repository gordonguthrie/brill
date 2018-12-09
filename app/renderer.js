// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var remote = require('electron').remote; 
var app = require('electron').remote.app;
var dialog = require('electron').remote.dialog;
var fs = require('fs');
var song = require('brill-song');

var currentsong;

// open the 'Open Song' dialog box
$('.ui.modal.brillopen').modal('show');

$('.ui.button.brillopen').click(function () {
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

$('.ui.button.brillnew').click(function () {
    var home = app.getPath('home');
    dialog.showSaveDialog({properties: ['openDirectory', 'CreateDirectory'],
			   defaultPath: home},
			  function (fileName) {
			      if(fileName === undefined){
				  // console.log("No file selected");
			      } else {
				  var selectedsong = fileName;
				  fs.mkdir(selectedsong, function(err){
				      if (err) {
					  return console.error(err);
				      }
				      render();
				      $('.ui.modal.brillopen').modal('hide');
				      currentsong = song.open(selectedsong)
});
			      }
			  }
			  )});


var render = function() {
    currentsong.dump();
}
