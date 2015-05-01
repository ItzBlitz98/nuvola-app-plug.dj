"use strict";

(function(Nuvola)
{

    // Create media player component
    var player = Nuvola.$object(Nuvola.MediaPlayer);

    // Handy aliases
    var PlaybackState = Nuvola.PlaybackState;
    var PlayerAction = Nuvola.PlayerAction;

    // Create new WebApp prototype
    var WebApp = Nuvola.$WebApp();

    // Initialization routines
    WebApp._onInitWebWorker = function(emitter)
    {
        Nuvola.WebApp._onInitWebWorker.call(this, emitter);

        var state = document.readyState;
        if (state === "interactive" || state === "complete")
            this._onPageReady();
        else
            document.addEventListener("DOMContentLoaded",
                    this._onPageReady.bind(this));
    }

    // Page is ready for magic
    WebApp._onPageReady = function()
    {
        // Connect handler for signal ActionActivated
        Nuvola.actions.connect("ActionActivated", this);

        // Set default action states
        player.setCanPlay(false);
        player.setCanPause(true);
				//player.setCanStop(false);
        player.setCanGoPrev(false);
        player.setCanGoNext(false);

        // Configure API hooks
        this.startApi();
    }

    // Loads the KEXP flowplayer API
    WebApp.startApi = function()
    {

			if(window.API.getMedia()){
				this.update();
			} else {
				setTimeout(this.startApi.bind(this), 100);
			}
    }


    // Extract data from the web page
    WebApp.update = function()
    {
      if(window.API.getMedia()){
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
				if(window.API.getVolume() > 0){
					var state = PlaybackState.PLAYING;
				} else {
					var state = PlaybackState.PAUSED;
				}


        player.setPlaybackState(state);

        // Schedule the next update
        setTimeout(this.update.bind(this), 500);
    }

    // Handler of playback actions
    WebApp._onActionActivated = function(emitter, name, param)
    {
				console.log(name);
        switch(name)
        {
					case PlayerAction.STOP:
						window.API.setVolume("0");
					break;
					case PlayerAction.TOGGLE_PLAY:
					window.API.setVolume("100");
					break;
          case PlayerAction.PLAY:
						window.API.setVolume("100");
						console.log("play?");
          break;
          case PlayerAction.PAUSE:
						window.API.setVolume("0");
						console.log("Pause?");
          break;
        }
    }

    WebApp.start();
})(this);
