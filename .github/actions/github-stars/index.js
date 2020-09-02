const core = require('@actions/core')
const fetch = require('node-fetch')

const { Headers } = fetch

async function main (githubToken) {
  const url = new URL('/user/starred', process.env.GITHUB_API_URL)
  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${githubToken}`
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
  main(process.env.GITHUB_TOKEN).then(function (markdown) {
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
