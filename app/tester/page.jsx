'use client';
import React, { useState } from 'react';
import * as Ably from 'ably';

const realtime = new Ably.Realtime({ key: '7DZZ5Q.CJ4P0g:XaoxDraL1nlhXGqBuRxhWv69luG-Ax6Nhy1obDQ7c9s' });


export default function AblyPubSub() {
  const [messages, setMessages] = useState([]);

async function handleClick(params) {
  try {
    const channel = realtime.channels.get('chatroom')
    await channel.subscribe(message=>console.log(message))
    await channel.publish('example','message data');
    
  } catch (error) {
    console.log(error)
  }
}




return (
  <div>
    <button onClick={handleClick}>
      Publish
    </button>
    {
      messages.map(message => {
        return <p key={message.id}>{message.data}</p>
      })
    }
  </div>
);

}