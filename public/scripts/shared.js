
function generateIds(ids, baseId) {
  return Object.keys(ids).reduce((acc, item) => {
    acc[item] = `${baseId}-${ids[item]}`
    return acc
  }, {})
}

function hashCode(text) {
  var hash = 0, i = 0, len = text.length;
  while ( i < len ) {
      hash  = ((hash << 5) - hash + text.charCodeAt(i++)) << 0;
  }
  return hash;
};