import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<Party channel={channel} />, root);
  // If there is no token, redirect to Spotify authorization to authorize the APP with SDK
  if (!_token) {
   window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
  }
}

// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '1563cdbe2b284610844bce69f7367ae7';
const redirectUri = 'http://localhost:4000/auth/spotify/callback/';
const scopes = [
  'streaming',
  'user-read-birthdate',
  'user-read-private',
  'user-modify-playback-state'
];



// Play a specified track on the Web Playback SDK's device ID
function play(device_id) {
  $.ajax({
   url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
   type: "PUT",
   data: '{"uris": ["spotify:track:3JrMXGfyYUlBNKrHe99Csy"]}',
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
   success: function(data) {
     console.log(data)
   }
  });
}

class Party extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = { authorized: false, users: [], song_queue: [], currently_playing: []
    }

    this.channel.join()
      .receive("ok", this.gotView.bind(this))
      .receive("error", resp => { console.log("Unable to join", resp) });
  }

  gotView(view) {
    console.log(view)
    this.setState(view.view);
  }

  render() {
    console.log("here1");
    // Set up the Web Playback SDK

    window.onSpotifyPlayerAPIReady = () => {
      const player = new Spotify.Player({
        name: 'LAS Spotify Player',
        getOAuthToken: cb => { cb(_token); }
      });

      // Error handling
      player.on('initialization_error', e => console.error(e));
      player.on('authentication_error', e => console.error(e));
      player.on('account_error', e => console.error(e));
      player.on('playback_error', e => console.error(e));

      // Playback status updates
      player.on('player_state_changed', state => {
        console.log(state)
        $('#current-track').attr('src',     state.track_window.current_track.album.images[0].url);
        $('#current-track-name').text(state.track_window.current_track.name);
      });

      // Ready
      player.on('ready', data => {
        console.log('Ready with Device ID', data.device_id);

        // Play a track using our new device ID
        play(data.device_id);
      });

      // Connect to the player!
      player.connect();
    }

    if (this.state.authorized) {
      return (
        <div>
          <p>
            User Entered the Party Room!!!
        </p>
        </div>
      )
    }
    else {
      return (
        <div>
          <p>
            YOU ARE NOT AUTHORIZED TO JOIN THIS PARTY
          </p>
        </div>
      )
    };
  }
}
