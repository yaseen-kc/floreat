const fs = require('fs')
const path = require('path')

const dir = path.resolve(__dirname, '..', '..')

function walk(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach(function (file) {
    file = path.join(dir, file)
    const stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.next') && !file.includes('dist')) {
        results = results.concat(walk(file))
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.prisma') || file.endsWith('.md')) {
        results.push(file)
      }
    }
  })
  return results
}

const files = walk(dir)
let totalReplacements = 0

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8')
  if (content.includes('CANOPY-')) {
    const newContent = content.replace(/CANOPY-/g, 'CANOPY_')
    fs.writeFileSync(file, newContent, 'utf8')
    console.log(`Replaced in ${file}`)
    totalReplacements++
  }
})

console.log(`Total files modified: ${totalReplacements}`)
