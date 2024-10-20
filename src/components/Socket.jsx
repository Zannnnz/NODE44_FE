import React from 'react'
import {io} from 'socket.io-client';

// tao doi tuong client cho  FE
const socket = io.connect("ws://localhost:8080");
socket.on("send-new-number",(data)=>{
    document.getElementById("noiDung").innerHTML = data
})
export default function Socket() {
  return (
    <div className='text-white'>
        <button onClick={()=>{
            socket.emit("send-click","")
        }}>click</button>
        <p id='noiDung'>0</p>

        <button
         id='reduceNumber' 
         onClick={()=>{
            //B1: client Ban event cho server
            socket.emit("reduce-number","")
         }}
        >reduce number</button>
    </div>
  )
}
