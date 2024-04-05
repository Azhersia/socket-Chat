'use client'
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

let socket: any;

export default function Socket() {
  const [message, setMessage] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [sentMessages, setSentMessages] = useState<any>([]);
  const [isInputChanged, setIsInputChanged] = useState(false); // 


  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('chat', (msg: string) => {

      setSentMessages(prevMessages => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function handleChange(e: any) {
    setMessage(e.target.value)
    setInputValue(e.target.value);
    setIsInputChanged(true);
  }

  function handleButton() {
    socket.emit('chat', inputValue);
    setInputValue('');
  }

  return (
    <div className='flex flex-col gap-4 text-black bg-slate-400 p-2'>
      <input onChange={handleChange} value={inputValue} type="text" className='bg-slate-600' />
      <button onClick={handleButton} className='bg-slate-600'>Send</button>
      <div className='flex gap-2'>
        {isInputChanged && message && <p>User is typing:</p>}
        {message}
      </div>


      <div className='bg-slate-600'>
        {sentMessages.map((msg: string, index: number) => (
          <div key={index} className="space-x-12 ml-2 ">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}