'use strict'

/**
 * Copyright Format
 * @param {integer} startYear this is the start year
 * @returns {string}
 */
function copyrightYear (startYear) {
  let year = ''
  const startyear = startYear
  const yearnow = new Date().getFullYear()
  if (startyear >= yearnow) {
    year = startyear
  } else {
    year = startyear + ' - ' + yearnow
  }
  return year
}

/**
 * Auto Generate Etag
 * @param {integer} afterNumHour value to generate after number hour
 * @returns {string}
 */
function autoEtag (afterNumHour) {
  if (afterNumHour >= 24) afterNumHour = 24
  const dt = new Date()
  const dd = ('0' + dt.getDate()).slice(-2)
  const mm = ('0' + (dt.getMonth() + 1)).slice(-2)
  const yy = dt.getFullYear()
  const fix = yy + '-' + mm + '-' + dd
  const rate = dt.getHours()
  const maxhour = 24
  const intervalhour = afterNumHour
  let n = 0
  for (let i = 0; i <= maxhour; i += intervalhour) {
    if (i <= rate) {
      n++
    }
  }
  return fix + n
}

module.exports = {
  copyrightYear,
  autoEtag
}
