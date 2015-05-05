(function(Nuvola) {

    "use strict";

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
    };

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
    };

    // Loads the KEXP flowplayer API
    WebApp.startApi = function() {

        if (document.getElementById("yt-frame")) {
            this.update();
        } else {
            setTimeout(this.startApi.bind(this), 100);
        }
    };


    // Extract data from the web page
    WebApp.update = function() {
        var track,
            artist,
            album,
            artLocation,
            art,
            state;


        if (document.getElementById("yt-frame")) {

            // Scrape track info
            track = window.API.getMedia().title;
            artist = window.API.getMedia().author;
            album = document.getElementById('room-name').getElementsByClassName('bar-value')[0].innerHTML;
            art = "http:" + window.API.getMedia().image;
            track = {
                title: track,
                artist: artist,
                album: album,
                artLocation: art
            };
            player.setTrack(track);
        } else {
            track = {
                title: null,
                artist: null,
                album: null,
                artLocation: null
            };
        }

        if (document.getElementById("playback-controls").classList.contains("snoozed")) {
            state = PlaybackState.PAUSED;
        } else {
            state = PlaybackState.PLAYING;
        }

        player.setPlaybackState(state);

        // Schedule the next update
        setTimeout(this.update.bind(this), 500);
    };

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
    };

    WebApp.start();
})(this);
