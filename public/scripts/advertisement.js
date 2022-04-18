
const ADVERTISEMENT_IDS = {
  CONTAINER: 'container',
  ITEM: 'item',
}

function createAdvertisement(rootId) {
  const ids = generateIds(ADVERTISEMENT_IDS, rootId)
  const advertisementRootEl = document.querySelector(`#${rootId}`)

  // Create container
  const advertisementContainerEl = document.createElement('div');
  advertisementContainerEl.id = ids.CONTAINER;
  advertisementContainerEl.className = 'advertisement-container';

  advertisementRootEl.appendChild(advertisementContainerEl); 

  // public methods
  function setAdvertisement (advertisements) {
    // TODO find the adv to remove
    const allIds = Array.from(advertisementContainerEl.childNodes).map(i => i.id)
    allIds.forEach(id => {
      if(!advertisements.find(adv => id === `${ids.ITEM}-${adv.type}_${hashCode(adv.content)}`)) {
        // remove
        const el = advertisementContainerEl.querySelector(`#${id}`)
        advertisementContainerEl.removeChild(el)
      }
    })
    advertisements.forEach(adv => {
      if(!allIds.find(id => id === `${ids.ITEM}-${adv.type}_${hashCode(adv.content)}`)) {
        // add item
        const advertisementEl = document.createElement('div')
        advertisementEl.id = `${ids.ITEM}-${adv.type}_${hashCode(adv.content)}`
        advertisementEl.className = 'advertisement-item'

        if (adv.type === 'image') {
          const img = document.createElement('img')
          img.style.width = '100%'
          img.src = adv.content;
          advertisementEl.appendChild(img)
        } else if (adv.type === 'text') {
          advertisementEl.innerText = adv.content
        } else if (adv.type === 'ad') {
          const a = document.createElement('a')
          a.href = adv.link;
          a.target = '_blank';
          a.innerText = adv.content;
          advertisementEl.appendChild(a)
        } else {
          console.warn('type not suported')
        }
        advertisementContainerEl.appendChild(advertisementEl)
      }
    })
  }


  return {
    setAdvertisement
  }
}