const express = require('express')
const router = express.Router()

const dirname = __dirname

// RELAY
router.get('/relay/list/:path', (req, res) => {
  var dir = `${dirname}/relay/${req.params.path}`

  fs.readdir(dir, (error, files) => {
    if (error) this.consoleerror(error)
    else {
      res.json(files)
      console.log(`RELAY -- List: ${req.params.path}`)
    }
  })
})

// DRAWER
router.get('/files/:username', (req, res) => {
  var dir = path.join(__dirname + '/drawer/' + req.params.username)
  if (fs.existsSync(dir)) {
    fs.readdir(dir, (error, filenames) => {
      if (error) {
        this.consoleerror(error)
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
router.get('/download/:username/:path', (req, res) => {
  res.download(path.join(__dirname + '/drawer/' + req.params.username + '/' + req.params.path))
  console.log(`DRAWER -- Downloaded: ${req.params.username}/${req.params.path}`)
})
router.delete('/file/:username/:path', (req, res) => {
  fs.unlink(path.join(__dirname + '/drawer/' + req.params.username + '/' + req.params.path), error => {
    if (error) {
      throw error
    }
    console.log(`DRAWER -- Deleted: ${req.params.username}/${req.params.path}`)
  })
})
router.post('/upload/:username', (req, res) => {
  var form = new formidable.IncomingForm()

  form.parse(req)

  form.on('fileBegin', (name, file) => {
    file.path = __dirname + '/drawer/' + req.params.username + '/' + file.name
  })

  form.on('file', (name, file) => {
    console.log(`DRAWER -- Uploaded: ${req.params.username}/${file.name}`)
  })
})

// OTHER
router.get('/terminal', (req, res) => {
  fs.readFile(`/relay/terminal.html`, (error, data) => {
    res.write(data)
  })
})
router.get('/terms', (req, res) => {
  fs.readFile(`/relay/terms.html`, (error, data) => {
    res.write(data)
  })
})
