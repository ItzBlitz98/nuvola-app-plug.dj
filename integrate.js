"use strict";

(function(Nuvola) {

  // Create media player component
  var player = Nuvola.$object(Nuvola.MediaPlayer);

  // Handy aliases
  var PlaybackState = Nuvola.PlaybackState;
  var PlayerAction = Nuvola.PlayerAction;

  // Create new WebApp prototype
  var WebApp = Nuvola.$WebApp();

  // Initialization routines
  WebApp._onInitWebWorker = function(emitter) {
    Nuvola.WebApp._onInitWebWorker.call(this, emitter);

    var state = document.readyState;
    if (state === "interactive" || state === "complete")
      this._onPageReady();
    else
      document.addEventListener("DOMContentLoaded",
        this._onPageReady.bind(this));
  }

  // Page is ready for magic
  WebApp._onPageReady = function() {
    // Connect handler for signal ActionActivated
    Nuvola.actions.connect("ActionActivated", this);

    // Set default action states
    player.setCanPlay(true);
    player.setCanPause(true);
    //player.setCanStop(false);
    player.setCanGoPrev(false);
    player.setCanGoNext(false);

    // Configure API hooks
    this.startApi();
  }

  // Loads the KEXP flowplayer API
  WebApp.startApi = function() {

    if (typeof(window.API.getMedia()) !== 'undefined') {
      this.update();
    } else {
      setTimeout(this.startApi.bind(this), 100);
    }
  }


  // Extract data from the web page
  WebApp.update = function() {
    if (typeof(window.API.getMedia()) !== 'undefined') {
      // Scrape track info
      var track = window.API.getMedia().title;
      var artist = window.API.getMedia().author;
      var album = "";
      var art = "http:" + window.API.getMedia().image;
      var track = {
        title: track,
        artist: artist,
        album: album,
        artLocation: art
      };
      player.setTrack(track);
    } else {
      var track = {
        title: "",
        artist: "",
        album: "",
        artLocation: ""
      };
    }

    if (document.getElementById("playback-controls").classList.contains("snoozed")) {
      var state = PlaybackState.PAUSED;
    } else {
      var state = PlaybackState.PLAYING;
    }

    player.setPlaybackState(state);

    // Schedule the next update
    setTimeout(this.update.bind(this), 500);
  }

  // Handler of playback actions
  WebApp._onActionActivated = function(emitter, name, param) {

    switch (name) {
      case PlayerAction.TOGGLE_PLAY:
        if (document.getElementById("playback-controls").classList.contains("snoozed")) {
          document.getElementById("playback-controls").getElementsByClassName("refresh")[0].click();
        } else {
          document.getElementById("playback-controls").getElementsByClassName("snooze")[0].click();
        }

        console.log("toggle play");
        //button refresh
        break;
      case PlayerAction.PLAY:
        document.getElementById("playback-controls").getElementsByClassName("refresh")[0].click();
        console.log("play");
        break;
      case PlayerAction.PAUSE:
        document.getElementById("playback-controls").getElementsByClassName("snooze")[0].click();
        console.log("pause");
        break;
      case PlayerAction.STOP:
        document.getElementById("playback-controls").getElementsByClassName("snooze")[0].click();
        console.log("stop");
        break;
      case PlayerAction.PREV_SONG:
        //not supported
        break;
      case PlayerAction.NEXT_SONG:
        //not supported
        break;
      default:
        throw {
          "message": "Not supported."
        };
    }
  }

  WebApp.start();
})(this);
