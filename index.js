const express = require('express')
const app = express()
const db = require('@cyclic.sh/dynamodb')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Create or Update an item
app.post('/watch/:key', async (req, res) => {
  console.log(req.body)

  const col = 'watch'
  const key = req.params.key
  if (key == null) {
    res.status(400).end()
  } else {
    const item = await db.collection(col).set(key, req.body)
    console.log(JSON.stringify(item, null, 2))
    res.status(200).end()
  }
})

// Delete an item
app.delete('/watch/:key', async (req, res) => {
  const col = 'watch'
  const key = req.params.key
  const item = await db.collection(col).delete(key)
  res.json(item).end()
})

// Get a single item
app.get('/watch/:key', async (req, res) => {
  const col = 'watch'
  const key = req.params.key
  console.log(`from collection: ${col} get key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).get(key)
  if (item == null) {
    res.status(404).end()
  } else {
    var json = item.props
    delete json.updated
    delete json.created
    res.json(json).end()
  }
})

// Get a full listing
app.get('/watch', async (req, res) => {
  const col = 'watch'
  const items = await db.collection(col).list()
  res.json(items).end()
})

// Catch all handler for all other request.
app.use('*', (req, res) => {
  res.status(204).end()
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
