const SEEKER_UPDATE_INTERVAL = 1000

const PLAYER_IDS = {
  BAR: 'bar',
  SEEKER: 'player-seeker',
  AUDIO_PLAYER: 'audio-player',
  BUTTONS_CONTAINER: 'buttons-container',
  PLAY_BUTTON: 'play-button',
  MARKER: 'marker',
}

const playerBarClickHandler = (ids) => {
  return (
    function onPlayerBarClick(e) {
      const audioEl = document.querySelector(`#${ids.AUDIO_PLAYER}`);

      if (audioEl.duration) {
        this.querySelector(`#${ids.SEEKER}`).style.left = e.layerX

        // calc seek position
        const barWidth = this.getClientRects()[0].width;
        const percentage = e.layerX / barWidth * 100
        const relativeNewTime = percentage * audioEl.duration / 100;
        audioEl.currentTime = relativeNewTime
      }
    }
  )
}

function calculateSeekerPosition(ids) {
  const audioEl = document.querySelector(`#${ids.AUDIO_PLAYER}`)
  
  const newOffset = (audioEl.currentTime * 100 / audioEl.duration) + '%';

  document.querySelector(`#${ids.SEEKER}`).style.left = newOffset
}

const calculateAdvertisementStatus = (ids, markers, setAdvertisement) => {
  if (!markers) {
    return 
  }
  const audioEl = document.querySelector(`#${ids.AUDIO_PLAYER}`)
  const advs = markers.filter((marker) => {
    return audioEl.currentTime > marker.start && audioEl.currentTime < (marker.start + marker.duration)
  })
  setAdvertisement(advs)
}

function createBarPlayer(rootId, {
  setAdvertisement
}) {
  const ids = generateIds(PLAYER_IDS, rootId)
  let _markers
  const barPlayerRootEl = document.querySelector(`#${rootId}`)

  // Bar Player - Bar

  const playerBar = document.createElement('div');
  playerBar.id = ids.BAR;
  playerBar.className = 'player-bar disabled';
  playerBar.onclick = playerBarClickHandler(ids)

  barPlayerRootEl.appendChild(playerBar); 

  // Bar Player - Seeker

  const playerBarSeeker = document.createElement('div');
  playerBarSeeker.id = ids.SEEKER;
  playerBarSeeker.className = 'player-seeker';

  playerBar.appendChild(playerBarSeeker); 

  // HTML audio element
  const audioPlayerEl = document.createElement('audio');
  audioPlayerEl.id = ids.AUDIO_PLAYER;
  audioPlayerEl.className = 'audio-player';
  barPlayerRootEl.appendChild(audioPlayerEl);

  // BUTTONS
  
  const playerPlayButtonsContainer = document.createElement('div');
  playerPlayButtonsContainer.id = ids.BUTTONS_CONTAINER;
  playerPlayButtonsContainer.className = 'play-buttons-container';

  barPlayerRootEl.appendChild(playerPlayButtonsContainer); 

  const playerPlayButton = document.createElement('button');
  playerPlayButton.id = ids.PLAY_BUTTON;
  playerPlayButton.className = 'play-button';
  playerPlayButton.innerText = 'PLAY'
  playerPlayButton.disabled = true;
  playerPlayButton.onclick = () => {
    if (audioPlayerEl.paused) {
      audioPlayerEl.play()
      playerPlayButton.innerText = 'PAUSE'
    } else {
      audioPlayerEl.pause()
      playerPlayButton.innerText = 'PLAY'
    }
    
  }

  playerPlayButtonsContainer.appendChild(playerPlayButton); 

  // seeker position updater
  setInterval(() => {
    calculateSeekerPosition(ids)
    calculateAdvertisementStatus(ids, _markers, setAdvertisement)
  }, SEEKER_UPDATE_INTERVAL)

  // Public methods
  function playTrackInPlayer(src) {
    const audioEl = document.querySelector(`#${ids.AUDIO_PLAYER}`);
    playerPlayButton.disabled = false;
    playerBar.classList.remove('disabled');
    audioEl.src = src;
    audioEl.pause();
    playerPlayButton.innerText = 'PLAY';
  }

  function loadMarkers(markers) {
    _markers = markers

    // remove previous markers
    const oldMarkes = playerBar.querySelectorAll(`.player-bar-marker`)
    oldMarkes.forEach(oldMarker => {
      oldMarker.parentElement.removeChild(oldMarker)
    })

    // add new ones
    markers.forEach((marker, index) => {
      const markerEl = document.createElement('div');
      markerEl.className = 'player-bar-marker';
      markerEl.style.background = `var(--complement-${index % 4})`;
      markerEl.style.left = (marker.start * 100 / audioPlayerEl.duration) + '%';
      
      const rightValue = (100 - ((marker.start + marker.duration) * 100 / audioPlayerEl.duration))
      markerEl.style.right = rightValue < 0 ? 0 : (rightValue + '%')
      playerBar.appendChild(markerEl)
    })
  }

  return {
    playTrackInPlayer,
    loadMarkers
  }
}