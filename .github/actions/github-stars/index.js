const core = require('@actions/core')
const fetch = require('node-fetch')

async function main (token) {
  const url = new URL('/user/starred', 'https://api.github.com')
  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (!response.ok) {
    throw Error(`HTTP ${response.status}`)
  }

  const data = await response.json()
  return data.map(({ full_name, description, html_url }) =>
    `- [${full_name}](${html_url})  \n` +
    `  ${description}`
  ).join('\n')
}

if (require.main === module) {
  main(process.env.TOKEN).then(function (markdown) {
    console.log(markdown)
    core.setOutput('markdown', markdown)
    process.exit(0)
  }, function (error) {
    console.error(error)
    process.exit(1)
  })
} else {
  module.exports = main
}
