import './App.css'
import { useScroll, useTransform, motion } from 'framer-motion'
import Comeco from './paginas/comeco'
import Parte from './paginas/parte'
import Cartao from './paginas/cartao'

function GlobalPath() {
  const { scrollYProgress } = useScroll()
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 5,
        overflow: 'visible',
      }}
    >
      <motion.path
        d="
          M 88 2
          C 91 5, 97 5, 97 10
          C 97 15, 88 20, 88 20
          C 88 20, 79 15, 79 10
          C 79 5, 85 5, 88 8

          C 88 22, 80 30, 70 36
          C 60 42, 45 38, 40 28
          C 35 18, 48 10, 50 20
          C 52 30, 38 34, 32 26
          C 26 18, 36 8, 38 18
          C 40 28, 25 30, 18 22
          C 11 14, 20 4, 22 14
          C 24 24, 8 26, 4 34
          C 0 42, 10 54, 24 50
          C 38 46, 48 34, 62 40
          C 76 46, 84 62, 70 68
          C 56 74, 36 68, 30 58
          C 24 48, 38 42, 44 52
          C 50 62, 36 72, 20 74
          C 4 76, -5 90, 12 94
          C 29 98, 55 90, 70 97
          C 85 104, 95 100, 80 100
        "
        fill="none"
        stroke="#cc1a1a"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength }}
      />
    </svg>
  )
}

function App() {
  return (
    <>
      <GlobalPath />
      <Comeco />
      <Parte />
      <Cartao />
    </>
  )
}

export default App