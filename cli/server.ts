import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Registry endpoint
app.get('/api/registry/:componentName', (req, res) => {
  const { componentName } = req.params
  const componentPath = path.join(process.cwd(), 'registry', `${componentName}.json`)

  try {
    const componentData = fs.readFileSync(componentPath, 'utf-8')
    const component = JSON.parse(componentData)
    res.json(component)
  } catch (error) {
    console.error('Error loading component:', error)
    res.status(404).json({ error: `Component ${componentName} not found` })
  }
})

// List all components
app.get('/api/registry', (req, res) => {
  const registryPath = path.join(process.cwd(), 'registry')

  try {
    const files = fs.readdirSync(registryPath)
    const components = files
      .filter((file: string) => file.endsWith('.json'))
      .map((file: string) => file.replace('.json', ''))

    res.json({ components })
  } catch (error) {
    res.status(500).json({ error: 'Failed to read registry' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Registry server running at http://localhost:${PORT}`)
  console.log(`📦 Available components: http://localhost:${PORT}/api/registry`)
})
