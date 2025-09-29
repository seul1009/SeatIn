import { useState } from 'react'
import StadiumScene from '../components/StadiumScene'
import MenuBar from '../components/MenuBar'

export default function Home() {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="relative w-full h-screen">
      <StadiumScene onZoomEnd={() => setShowMenu(true)} />
      <MenuBar visible={showMenu} />
    </div>
  )
}
