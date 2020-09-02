const fetch = require('node-fetch')
const Jimp = require('jimp')

async function main () {
  const matchResponse = await fetch('https://api.battle.pokemon-home.com/cbd/competition/rankmatch/list', {
    method: 'POST',
    body: JSON.stringify({ soft: 'Sw' })
  })

  const matchData = await matchResponse.json()

  const seasonId = Object.keys(matchData.list).sort((a, b) => Number(a) - Number(b)).slice(-1)[0]
  const [matchId, { rst, ts2 }] = Object.entries(matchData.list[seasonId]).filter(([id, { rule }]) => rule === 0)[0]
  const pokemonResponse = await fetch(`https://resource.pokemon-home.com/battledata/ranking/${matchId}/${rst}/${ts2}/pokemon`)

  const pokemonData = await pokemonResponse.json()

  const result = await Jimp.create(1000, 100)
  let x = 0
  for (const { id, form } of pokemonData.slice(0, 10)) {
    const idString = String(id).padStart(4, '0')
    const formString = String(form).padStart(2, '0')
    const url = `https://resource.pokemon-home.com/battledata/img/poke/cap${idString}_f${formString}_s0.png`
    const image = await Jimp.read(url)
    result.blit(image, x, 0)
    x += 100
  }

  return result
}

if (require.main === module) {
  main().then(async function (image) {
    await image.writeAsync(process.env.OUTPUT)
    process.exit(0)
  }, function (error) {
    console.error(error)
    process.exit(1)
  })
} else {
  module.exports = main
}
