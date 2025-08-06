import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import useSocket from './api/useSocket'
import useNotification from './api/useNotification'

function App() {
  const [count, setCount] = useState(0)
  const socket = useSocket();
  const notification = useNotification();

  useEffect(() => {
    socket.on('notification', (msg) => {
      console.log('Socket notification received:', msg);
      notification.success(`Socket: ${msg}`);
    });
    return () => socket.off('notification');
  }, [socket, notification]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
