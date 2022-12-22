const core = require('@actions/core')
const asciichart = require('asciichart')
const fetch = require('node-fetch')

async function main (alphaVantageAPIKey) {
  const url = new URL('/query', 'https://www.alphavantage.co/')
  url.searchParams.set('function', 'TIME_SERIES_DAILY_ADJUSTED')
  url.searchParams.set('symbol', 'MSFT')
  url.searchParams.set('apikey', alphaVantageAPIKey)

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw Error(`HTTP ${response.status}`)
  }

  const data = await response.json()
  const meta = data['Meta Data']
  const series = data['Time Series (Daily)']
  const times = Object.keys(series).sort()
  const prices = times.map(function (time) {
    const price = Number(series[time]['4. close'])
    return Number.isFinite(price) ? price : undefined
  })

  const chart = asciichart.plot(prices, { height: 20 })
  return `
> ${times[0]} - ${times[times.length - 1]}

${chart}

> Last Refreshed: ${meta['3. Last Refreshed']}
  `.trim()
}

if (require.main === module) {
  main(process.env.ALPHA_VANTAGE_API_KEY).then(function (chart) {
    console.log(chart)
    core.setOutput('chart', chart)
    process.exit(0)
  }, function (error) {
    console.error(error)
    process.exit(1)
  })
} else {
  module.exports = main
}
