const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
const bodyParser = require('body-parser')
const socket = require('socket.io')

const ChatroomModel = require('./models/Chatroom.js')

mongoose.promise = global.Promise

const PORT = process.env.PORT || 80
const app = express()

const server = app.listen(PORT, () => {
  console.log(`Flamechat server is listening at localhost:${PORT}`)
})

const io = socket(server)

app.use(cors())

app.use(bodyParser.json())

require('./config/passport')(passport)

app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize())

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)

// ROVER
app.use('/rover', express.static(__dirname + '/rover'))

// RELAY
app.use('/relay', express.static(__dirname + '/files'))

app.use('/users', require('./routes/users.js'))
app.use('/users/migrate', require('./routes/migrate.js'))
app.use('/flamechat', require('./routes/flamechat.js'))
app.use('/paradox', require('./routes/paradox.js'))
app.use('/media', require('./routes/media.js'))
app.use('/drawer', require('./routes/drawer.js'))

mongoose.connect('mongodb://localhost:27017/paradigm', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('MongoDB server connected...')).catch(error => console.error(error))

io.on('connection', socket => {
  console.log(socket.id, 'connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

ChatroomModel.find({}, (error, data) => {
  if (error) console.error(error)
  else {
    data.forEach(chatroom => {
      var namespace = io.of(`/flamechat/${chatroom.id}`).on('connection', async socket => {
        console.log(chatroom.id)
        var Chatroom = await ChatroomModel.findOne({ id: chatroom.id })
        socket.emit('data', Chatroom)
        socket.on('message', async data => {
          await Chatroom.messages.push(data)
          await Chatroom.save()
          console.log(chatroom.id, data)
          namespace.emit('message', data)
        })
        socket.on('delete', async id => {
          var Message = await Chatroom.messages.id(id)
          await Message.remove()
          await Chatroom.save()
          namespace.emit('delete', id)
          console.log(id, 'deleted')
        })
      })
    })
  }
})
