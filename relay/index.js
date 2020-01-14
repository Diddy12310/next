// (c) Paradigm Development
// Paradigm Relay File Server Technology
// All Rights Reserved.

const express = require('express')
const formidable = require('formidable')
const fs = require('fs')
const cors = require('cors')
const path = require('path')

const app = express()
const port = '80'
const ip = '192.168.1.63'

app.use(cors())


// EXPLORER
app.use('/rover', express.static('./rover/dist'))


// RELAY

app.use('/', express.static('relay'))

app.get('/relay/list/:path', (req, res) => {
  if (req.params.path !== 'index') {
    var dir = path.join(__dirname + '/relay/' + req.params.path)
  } else {
    var dir = path.join(__dirname + '/relay')
  }
  fs.readdir(dir, (error, filenames) => {
    if (error) {
      console.error(error)
    } else {
      res.json(filenames)
      console.log(`RELAY -- List: ${req.params.path}`)
    }
  })
})


// DRAWER

app.get('/files/:username', (req, res) => {
  var dir = path.join(__dirname + '/uploads/' + req.params.username)
  if (fs.existsSync(dir)) {
    fs.readdir(dir, (error, filenames) => {
      if (error) {
        console.error(error)
      } else {
        res.json(filenames)
        console.log(`DRAWER -- Sent: ${req.params.username}/file list`)
      }
    })
	} else {
    fs.mkdirSync(dir)
    console.log(`DRAWER -- Created: ${req.params.username}`)
  }
})

app.get('/download/:username/:path', (req, res) => {
  res.download(path.join(__dirname + '/uploads/' + req.params.username + '/' + req.params.path))
  console.log(`DRAWER -- Downloaded: ${req.params.username}/${req.params.path}`)
})

app.delete('/file/:username/:path', (req, res) => {
  fs.unlink(path.join(__dirname + '/uploads/' + req.params.username + '/' + req.params.path), error => {
    if (error) {
      throw error
    }
    console.log(`DRAWER -- Deleted: ${req.params.username}/${req.params.path}`)
  })
})

app.post('/upload/:username', (req, res) => {
  var form = new formidable.IncomingForm()

  form.parse(req)

  form.on('fileBegin', (name, file) => {
    file.path = __dirname + '/uploads/' + req.params.username + '/' + file.name
  })

  form.on('file', (name, file) => {
    console.log(`DRAWER -- Uploaded: ${req.params.username}/${file.name}`)
  })
})

app.listen(port, ip)

console.log(`
(c) Paradigm Development
Paradigm Relay File Server Technology
All Rights Reserved.

Ready! Listening on http://${ip}:${port}.
`)