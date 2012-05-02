/*

// Basic usage
sm2.initialize({
  url: 'http://www.example.org/path/to/soundmanager2/swf/'
});
sm2.play('/path/to/sound.mp3');
sm2.pause('/path/to/sound.mp3');

// Enable looping
var loop = true;
sm2.play('/path/to/sound.mp3', loop);

// Toggle play/pause
var playing = sm2.toggle('/path/to/sound.mp3');

// Set a callback when the sound finishes
// Note: the second argument can either be a boolean (to control looping) or
//       a function (as a callback)
sm2.play('/path/to/mp3', function() {
  // do something here
});

// Using a playlist
var playlist = [
  '/path/to/1.mp3',
  '/path/to/2.mp3',
  '/path/to/3.mp3'
];
var position = 0;
function play_next() {
  pause_current();
  position = (position + 1) % playlist.length;
  play_current();
}
function callback() {
  play_next();
}
function play_current() {
  sm2.play(playlist[position], callback);
}
function pause_current() {
  sm2.pause(playlist[position]);
}
function toggle_current() {
  sm2.toggle(playlist[position], callback);
}

*/

var sm2 = {

 sounds: {},
 ready: false,
 queue: [],
 count: 0,

 defaults: {
   url: '/soundmanager2/swf/',
   flashVersion: 9,
   useFlashBlock: true,
   consoleOnly: true,
   bgColor: '#FFFFFF'
 },

 initialize: function(options) {
   if (!options) {
     options = {};
   }
   for (var key in this.defaults) {
     soundManager[key] = this.defaults[key];
   }
   for (var key in options) {
     soundManager[key] = options[key];
   }
   var self = this;
   soundManager.onready(function() {
     self.ready = true;
     if (self.queue) {
       for (var i = 0; i < self.queue.length; i++) {
         self.play(self.queue[i]);
       }
       self.queue = [];
     }
   });
   soundManager.ontimeout(function() {
     alert('Oops, there was a problem playing sound!');
   });
 },

 play: function(url, option) {
   if (!this.ready) {
     this.queue.push(url);
     return false;
   }
   var sound = this.sounds[url];
   if (!sound) {
     this.count++;
     sound = soundManager.createSound({
       id: 'sm2_' + this.count,
       url: url,
       onfinish: function() {
         if (this.loop) {
           this.play();
         } else if (this.callback) {
           this.callback.apply(this);
         }
       }
     });
     this.sounds[url] = sound;
   }
   if (option === true) {
     sound.loop = true;
   } else if (typeof option === 'function') {
     sound.callback = option;
   }
   sound.play();
   return true;
 },

 pause: function(url) {
   if (!this.sounds[url]) {
     return false;
   }
   this.sounds[url].pause();
 },

 toggle: function(url, option) {
   if (!this.sounds[url] || this.sounds[url].paused) {
     this.play(url, option);
     return true;
   } else {
     this.pause(url);
     return false;
   }
 }

};
