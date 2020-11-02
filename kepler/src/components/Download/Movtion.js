export function createMovtion(startId, endId) {
  let start = getPositionOfDom(startId)
  let end = getPositionOfDom(endId)
  let div = document.createElement('div')
  div.style.width = '32px'
  div.style.height = '32px'
  div.style.backgroundImage = `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACG0lEQVRYR+2XPUwUQRTH/2/IkUhCZ2VlrZWBUBKoiESvkF1ye8DdLiaamFjQaAkkNhZ+JFaYEPYucLuwwzWYmNiAJQZLKW0tbSy5eWY33nlubndnIx6R3LTzPn7zdva9/xAueNEF58f/BWC4pZcQdEuraixeyOrOuyxb7QoYNYujYISjrKBgTBHwXRHf3q/4x2n2WgDRyYlWoHhaOn4qgLFVWoOgVTCWQXiqzmi2eb/xNQkiEeDuhnW1MMx3BHAdQkyA+IqseNNZp28DyKpHc671jIBJGjmbDeaDH718ewKY2ws3uKW+/OFAOMoDoMTQtebS9jfDtTwCCoHtGdoA7VMoxU7T8V2jbh2GzjoAc7XSMoE2obAiHe916GfWy5+UUif7tv8oDtGzAvGEeQBMtzzGxCdRIsXrnYSCHkPxG+n4a90Q5w4QBr+3VbJJ0CqF96d7KV7vC0CYs7hZHB0WI2NdFTgMK9I3gPi3jvrIpQKI/pSURYWhvWBx57Rtcu4V6LTmBAgiHAQVr/jPALI64uAODO7A5b8D/f0LfqkcYnoY2I23uZN3VJKakfbuh9zTMHQwalY4Yn8Pl7wUCYJGaxx3ulm9bKKlbmrlFpGGfBXZCj6W1d33+oqobj0H44mOCO0V1HTLD5h4A0TzstIIUmdG0mYuGR4PwpgC8FlWvfGsaqXK8lwPke5MLf4YFx5JIFrvgqxT/M3+AOAnYN6NMBgk9dMAAAAASUVORK5CYII=)`
  let styleObj = {
    position: 'fixed',
    top: start.top + 'px',
    left: start.left + start.width / 2 - 16 + 'px',
    transition: 'all 0.6s'
  }
  for (const key in styleObj) {
    div.style[key] = styleObj[key]
  }
  document.body.appendChild(div)
  setTimeout(() => {
    div.style.top = end.top + 'px'
    div.style.left = end.left + 'px'
    setTimeout(() => {
      document.body.removeChild(div)
    }, 400)
  }, 100)
}

function getPositionOfDom(id) {
  let dom = document.getElementById(id)
  let position = {}
  if (dom) {
    position = dom.getBoundingClientRect()
  }
  return position
}
