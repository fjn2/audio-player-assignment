
const EPISODES_IDS = {
  CONTAINER: 'container',
  ITEM: 'item',
}

function fetchData() {
  return fetch('http://localhost:1337/episodes').then(r => r.json())
}


async function createEpisodes(rootId, { playEpisody, loadMarkers }) {
  const ids = generateIds(EPISODES_IDS, rootId)
  const barPlayerRootEl = document.querySelector(`#${rootId}`)

  // Create container
  const episoesContainerEl = document.createElement('div');
  episoesContainerEl.id = ids.CONTAINER;
  episoesContainerEl.className = 'episodes-container';

  barPlayerRootEl.appendChild(episoesContainerEl); 

  // Fetch data
  const episodes = await fetchData()

  // render items in data
  episodes.forEach((episody) => {
    const episodyItemEl = document.createElement('div');
    episodyItemEl.id = `${ids.ITEM}-${episody.id}`;
    episodyItemEl.className = 'episody-item';
    episodyItemEl.innerText = episody.name

    episodyItemEl.onclick = () => {
      playEpisody(episody.audio)
      // TODO improve this solution (the timeout)
      setTimeout(() => {
        loadMarkers(episody.markers)
      }, 500)
    }

    episoesContainerEl.appendChild(episodyItemEl); 
  })

  
}