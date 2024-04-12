
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { io } from "socket.io-client"
import { Typography } from "@mui/material";


function App() {
  const [message, setMessage] = useState("")
  const [roomName, setRoomName] = useState("")
  const [room, setRoom] = useState("")
  const [socketID, setSocketID] = useState("")
  const [messages, setMessages] = useState([])
  console.log("🚀 ~ file: App.jsx:13 ~ App ~ messages:", messages)

  const socket = useMemo(() => io("http://localhost:3000/"), [])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit("message", { message, room })
    setMessage("")
    // setRoom("")
  }
  const joinGroupHanlder = () => {

    socket.emit("join-room", roomName)
    setRoomName("")
  }
  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id)
    })
    socket.on("welcome", (s) => {
      console.log("🚀 ~ file: App.jsx:14 ~ socket.on ~ s:", s)

    })
    socket.on("recieve-message", (data) => {
      setMessages((prev) => [...prev, data])
      console.log("🚀 ~ file: App.jsx:27 ~ socket.on ~ data:", data)

    })
    return () => {
      socket.disconnect()
    }
  }, [])
  return (
    <>
      <div className="flex w-1/2 justify-between items-center mx-auto my-5 ">
        <h1 className='text-4xl text-center'>webSocket.io</h1>
        <p className='font-extrabold text-xl text-emerald-950 text-center'>{socketID}</p>
      </div>
      <form className='w-1/2 p-10 mx-auto bg-gray-200' onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className='mb-2 block text-lg font-semibold'>message</label>
          <input value={message} type="text" name='message' className='px-3 py-1 rounded-sm focus:outline-none border border-gray-500 w-full' onChange={(e) => setMessage(e.target.value)} />

        </div>
        <div
          className='flex justify-between items-center w-full'>
          <div className="mb-3">
            <label className='mb-2 block text-lg font-semibold'>Room</label>
            <input value={room} type="text" name='message' className='px-3 py-1 rounded-sm focus:outline-none border border-gray-500 w-full' onChange={(e) => setRoom(e.target.value)} />

          </div>
          <div className="mb-3">
            <label className='mb-2 block text-lg font-semibold'>Room-Name</label>
            <input value={roomName} type="text" name='message' className='px-3 py-1 rounded-sm focus:outline-none border border-gray-500 w-full' onChange={(e) => setRoomName(e.target.value)} />
            <button type='button' onClick={joinGroupHanlder} className='px-3 py-2 ml-auto block mt-2 bg-black text-white'>join group</button>
          </div>
        </div>

        <button type='submit' className='px-3 py-2 mx-auto block mt-10 bg-black text-white'>send message</button>
      </form>

      {messages.length > 0 &&
        <div className="mt-5 p-10 bg-gray-200 w-1/2 mx-auto" >
          {messages?.map((msg, index) => (
            <div key={index}>
              <p className='text-black'>{msg}</p>
            </div>
          ))}
        </div>}
      
    </>
  )
}

export default App
