import { useState, useEffect, useId } from 'react'
import { motion } from 'framer-motion'
import opentype from 'opentype.js'
import './comeco.css'

function Assinatura({ text, color = '#cc1a1a', fontSize = 80, duration = 2, delay = 0 }) {
  const [paths, setPaths] = useState([])
  const [width, setWidth] = useState(400)
  const height = fontSize * 3
  const horizontalPadding = fontSize * 0.1
  const baseline = fontSize * 1.5
  const maskId = `mask-${useId().replace(/:/g, '')}`

useEffect(() => {
  async function load() {
    try {
      const response = await fetch('https://www.componentry.fun/LastoriaBoldRegular.otf')
      const buffer = await response.arrayBuffer()
      const font = opentype.parse(buffer)

      let x = horizontalPadding
      const newPaths = []
      for (const char of text) {
        const glyph = font.charToGlyph(char)
        const path = glyph.getPath(x, baseline, fontSize)
        newPaths.push(path.toPathData(3))
        const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm
        x += advanceWidth * (fontSize / font.unitsPerEm)
      }
      setPaths(newPaths)
      setWidth(x + horizontalPadding)
    } catch (e) {
      console.error(e)
    }
  }
  load()
}, [text, fontSize, baseline, horizontalPadding])

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  }

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ overflow: 'visible' }}
      initial="hidden"
      animate="visible"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {paths.map((d, i) => (
            <motion.path
              key={i} d={d}
              stroke="white"
              strokeWidth={fontSize * 0.22}
              fill="none"
              variants={variants}
              transition={{
                pathLength: { delay: delay + i * 0.15, duration, ease: 'easeInOut' },
                opacity: { delay: delay + i * 0.15 + 0.01, duration: 0.01 },
              }}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </mask>
      </defs>
      {paths.map((d, i) => (
        <motion.path
          key={i} d={d}
          stroke={color}
          strokeWidth={2}
          fill="none"
          variants={variants}
          transition={{
            pathLength: { delay: delay + i * 0.15, duration, ease: 'easeInOut' },
            opacity: { delay: delay + i * 0.15 + 0.01, duration: 0.01 },
          }}
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      ))}
      <g mask={`url(#${maskId})`}>
        {paths.map((d, i) => <path key={i} d={d} fill={color} />)}
      </g>
    </motion.svg>
  )
}



function Inicio() {
  const [revelar, setRevelar] = useState(false)
  const [entrar, setEntrar] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setRevelar(true), 6300)  //tempo para a cortina abrir
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (revelar) {
      const timer = setTimeout(() => setEntrar(true), 1200) // aguarda a cortina terminar de subir
      return () => clearTimeout(timer)
    }
  }, [revelar])

  const transicao = { duration: 0.9, ease: [0.76, 0, 0.24, 1] }

  return (
    <>
      <div className={`cortina ${revelar ? 'cortina-subindo' : ''}`}>
        <div className="cortina-nomes">
          <Assinatura text="Bianca & Vinicius" color="#cc1a1a" fontSize={80} duration={2.5} delay={0.3} />
        </div>
      </div>

      <div className="inicio-container">
        <motion.span
          className="data-esquerda"
          initial={{ x: -120, opacity: 0 }}
          animate={entrar ? { x: 0, opacity: 1 } : { x: -120, opacity: 0 }}
          transition={{ ...transicao, delay: 0 }}
        >13/10/2024</motion.span>

        <motion.span
          className="data-direita"
          initial={{ x: 120, opacity: 0 }}
          animate={entrar ? { x: 0, opacity: 1 } : { x: 120, opacity: 0 }}
          transition={{ ...transicao, delay: 0 }}
        >12/06/∞</motion.span>

        <motion.span
          className="nome-esquerda"
          initial={{ x: -120, opacity: 0 }}
          animate={entrar ? { x: 0, opacity: 1 } : { x: -120, opacity: 0 }}
          transition={{ ...transicao, delay: 0.15 }}
        >Vinícius Kawasugui Santiago</motion.span>

        <motion.span
          className="nome-direita"
          initial={{ x: 120, opacity: 0 }}
          animate={entrar ? { x: 0, opacity: 1 } : { x: 120, opacity: 0 }}
          transition={{ ...transicao, delay: 0.15 }}
        >Bianca Pereira De Souza</motion.span>

        <motion.h1
          className="inicio-titulo"
          initial={{ y: -160, opacity: 0 }}
          animate={entrar ? { y: 0, opacity: 1 } : { y: -160, opacity: 0 }}
          transition={{ ...transicao, delay: 0.05 }}
        >
          <span className="titulo-linha-feliz">FELIZ DIA DOS</span>
          <span className="titulo-linha-namorados">NAMORADOS</span>
        </motion.h1>




        <motion.div
          className="imagemgay1-1"
          initial={{ y: 120, opacity: 0 }}
          animate={entrar ? { y: 0, opacity: 1 } : { y: 120, opacity: 0 }}
          transition={{ ...transicao, delay: 0 }}
        >
          <img src="/1.png" alt="foto gay" className="imagemgay1" />
        </motion.div>
      </div>
    </>
  )
}

export default Inicio