const ChatroomModel = require('./../models/Chatroom.js')
const mongoose = require('mongoose')

module.exports = io => {
  ChatroomModel.find({}, (error, data) => {
    if (error) console.error(error)
    else {
      data.forEach(chatroom => {
        var namespace = io.of(`/flamechat/${chatroom.id}`).on('connection', async socket => {
          var chatroom_id = chatroom.id
          var Chatroomed = await ChatroomModel.findOne({ id: chatroom_id })
          socket.emit('data', Chatroomed)
          socket.on('message', async data => {
            var data = data
            var Chatroom = await ChatroomModel.findOne({ id: chatroom_id })
            data._id = mongoose.Types.ObjectId()
            await Chatroom.messages.push(data)
            await Chatroom.save()
            namespace.emit('message', data)
          })
          socket.on('delete', async id => {
            var Chatroom = await ChatroomModel.findOne({ id: chatroom_id })
            var Message = await Chatroom.messages.id(id)
            await Message.remove()
            await Chatroom.save()
            namespace.emit('delete', id)
          })
        })
      })
    }
  })
}