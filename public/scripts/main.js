function main () {
  const advertisementMethods = createAdvertisement('advertisement-root')

  const barPlayerMethods = createBarPlayer('root', {
    setAdvertisement: advertisementMethods.setAdvertisement
  })
  createEpisodes('episodes-root', {
    playEpisody: barPlayerMethods.playTrackInPlayer,
    loadMarkers: barPlayerMethods.loadMarkers
  })
}


main()