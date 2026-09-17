import { useState } from 'react'
import './styles/App.css'
import Mikudle from './components/Mikudle'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="page-background">
        <section id="center">
          <Mikudle />
        </section>

      </div>
    </>
  )
}

export default App
