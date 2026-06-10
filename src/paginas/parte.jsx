import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import './parte.css';

const IMAGES = [
  `${import.meta.env.BASE_URL}imgagem1.jpg`,
  `${import.meta.env.BASE_URL}imgagem2.jpg`,
  `${import.meta.env.BASE_URL}imgagem3.jpg`,
  `${import.meta.env.BASE_URL}imgagem4.jpg`,
  `${import.meta.env.BASE_URL}imgagem5.jpg`,
  `${import.meta.env.BASE_URL}imgagem6.jpg`,
  `${import.meta.env.BASE_URL}imgagem7.jpg`,
  `${import.meta.env.BASE_URL}imgagem8.jpg`
];

function FloatingImage({ index, scrollYProgress, url }) {
  const row = Math.floor(index / 4);
  const col = index % 4;
  const start = index * 0.08;
  const end = start + 0.08;
  const pivot = start + 0.04;
  const targetX = 10 + (col * 22);
  const targetY = 30;

  const x = useTransform(
    scrollYProgress,
    [0, start, pivot, end],
    ["110vw", "110vw", "50vw", `${targetX}vw`]
  );

  const yBase = useTransform(
    scrollYProgress,
    [0, start, pivot, end],
    ["110vh", "110vh", "10vh", `${targetY}vh`]
  );

  const liftTrigger = 0.35;
  const yScrollUp = useTransform(
    scrollYProgress,
    [liftTrigger + (row * 0.2), liftTrigger + (row * 0.2) + 0.3],
    ["0vh", "-100vh"]
  );

  const smoothX = useSpring(x, { stiffness: 60, damping: 15 });
  const smoothY = useSpring(yBase, { stiffness: 60, damping: 15 });

  return (
    <motion.div
      className="moving-card"
      style={{
        left: smoothX,
        top: smoothY,
        y: yScrollUp,
        position: 'fixed',
        zIndex: 100 + index
      }}
    >
      <img src={url} alt={`img-${index}`} />
    </motion.div>
  );
}

function Parte() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 0.9], [0, 1, 1, 0]);
  const uiOpacity    = useTransform(scrollYProgress, [0, 0.08, 0.85, 0.95], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="parte-wrapper">
      <div className="sticky-content">

        {/* linha superior */}
        <motion.div className="parte-linha" style={{ opacity: uiOpacity }} />

        {/* topo editorial */}
        <motion.div className="parte-topo" style={{ opacity: uiOpacity }}>
          <div>
            <div className="parte-topo-label">Bianca &amp; Vinícius</div>
            <div className="parte-topo-label">13/10/2024 — 12/06/∞</div>
          </div>
          <div>
            <div className="parte-topo-label" style={{ textAlign: 'right' }}>Nossa história</div>
            <div className="parte-topo-label" style={{ textAlign: 'right' }}>em imagens</div>
          </div>
          <div className="parte-numero">(02)</div>
        </motion.div>

        {/* título principal */}
        <motion.h2
          className="parte-titulo"
          style={{ opacity: titleOpacity }}
        >
          NOSSAS<br />FOTOS
        </motion.h2>

        {/* cards de imagem — animação original preservada */}
        {IMAGES.map((url, index) => (
          <FloatingImage
            key={index}
            index={index}
            url={url}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* rodapé editorial */}
        <motion.div className="parte-rodape" style={{ opacity: uiOpacity }}>
          <span className="parte-rodape-label">Momentos que ficam</span>
          <span className="parte-rodape-label">Role para ver mais ↓</span>
        </motion.div>

      </div>
    </div>
  );
}

export default Parte;