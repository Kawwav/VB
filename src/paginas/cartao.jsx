import React, { useEffect, useRef, useState, Suspense, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import './cartao.css';

// ─── Music Player ─────────────────────────────────────────────────────────────
function MusicPlayer({ src, coverArt, autoPlay = false }) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef(null);
  const iframeRef = useRef(null);

  const handleVolume = useCallback((delta, e) => {
    e.stopPropagation();
    setVolume(v => {
      const next = Math.min(100, Math.max(0, v + delta));
      if (audioRef.current) audioRef.current.volume = next / 100;
      return next;
    });
  }, []);

  const getYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
    );
    return match ? match[1] : null;
  };

  const youtubeId = src ? getYoutubeId(src) : null;

  useEffect(() => {
    if (isPlaying) {
      if (youtubeId && iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
        );
      } else {
        audioRef.current?.play().catch(() => setIsPlaying(false));
      }
    } else {
      if (youtubeId && iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*'
        );
      } else {
        audioRef.current?.pause();
      }
    }
  }, [isPlaying, youtubeId]);

  return (
    <div className="music-player" onClick={() => setIsPlaying(p => !p)} title={isPlaying ? 'Pausar' : 'Tocar'}>
      {youtubeId ? (
        <iframe
          ref={iframeRef}
          className="music-player__hidden"
          src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=${autoPlay ? 1 : 0}&controls=0`}
          allow="autoplay"
        />
      ) : (
        <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} className="music-player__hidden" />
      )}

      {/* Tonearm */}
      <motion.div
        className="music-player__tonearm"
        initial={{ rotate: 10 }}
        animate={{ rotate: isPlaying ? -20 : 10 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <div className="music-player__tonearm-base" />
        <div className="music-player__tonearm-stick">
          <div className="music-player__tonearm-needle" />
        </div>
      </motion.div>

      {/* Disco */}
      <div
        className="music-player__disc"
        style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
      >
        {/* capa */}
        <div
          className="music-player__cover"
          style={{ backgroundImage: coverArt ? `url(${coverArt})` : 'none' }}
        />
        {/* ranhuras */}
        <div className="music-player__grooves" />
        {/* brilho */}
        <div className="music-player__glare" />
        {/* centro */}
        <div className="music-player__center">
          <div className="music-player__pin" />
        </div>
      </div>

      {/* label play/pause */}
      <div className="music-player__label">
        {isPlaying ? '■ pausar' : '▶ tocar'}
      </div>

      {/* Controle de volume */}
      <div className="music-player__volume" onClick={e => e.stopPropagation()}>
        <button
          className="music-player__vol-btn"
          onClick={(e) => handleVolume(-10, e)}
          title="Diminuir volume"
          aria-label="Diminuir volume"
        >−</button>
        <div className="music-player__vol-track">
          <div
            className="music-player__vol-fill"
            style={{ width: `${volume}%` }}
          />
        </div>
        <button
          className="music-player__vol-btn"
          onClick={(e) => handleVolume(+10, e)}
          title="Aumentar volume"
          aria-label="Aumentar volume"
        >+</button>
      </div>
    </div>
  );
}

// ─── Modelo 3D da Rosa ────────────────────────────────────────────────────────
// Injeta dinamicamente a subpasta do GitHub /VB/ caso esteja em produção
const ROSA_PATH = `${import.meta.env.BASE_URL}rosa.gltf`;

function RosaModel() {
  const { scene } = useGLTF(ROSA_PATH);
  const [scale, setScale] = React.useState(1);
  const [center, setCenter] = React.useState([0, 0, 0]);

  React.useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const mid = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(mid);
    const maxAxis = Math.max(size.x, size.y, size.z);
    const s = 3.8 / maxAxis;
    setScale(s);
    setCenter([-mid.x * s, -mid.y * s, -mid.z * s]);
  }, [scene]);

  return <primitive object={scene} scale={scale} position={center} />;
}

function RosaLoader() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#cc1a1a" wireframe />
    </mesh>
  );
}

// ─── Cartao ───────────────────────────────────────────────────────────────────
function Cartao() {
  const mouseRef = useRef({ x: -100, y: -100 });
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const rafCursorRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    if (!rafCursorRef.current) {
      rafCursorRef.current = requestAnimationFrame(() => {
        setMousePos({ ...mouseRef.current });
        rafCursorRef.current = null;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafCursorRef.current) cancelAnimationFrame(rafCursorRef.current);
    };
  }, [handleMouseMove]);

  return (
    <div className="cartao">

      {/* Header editorial */}
      <div className="cartao__header">
        <div>
          <div className="cartao__header-label">Bianca &amp; Vinícius</div>
          <div className="cartao__header-label">13/10/2024 — 12/06/∞</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="cartao__header-label">Dia dos Namorados</div>
          <div className="cartao__header-label">2025</div>
        </div>
        <div className="cartao__header-num">(03)</div>
      </div>

      {/* Linha fina */}
      <div className="cartao__header-line" />

      {/* Título gigante de fundo */}
      <div className="cartao__titulo-bg" aria-hidden="true">
        PARA<br />SEMPRE
      </div>

      {/* Canvas 3D */}
      <div className="cartao__canvas-wrapper">
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 40 }}
          className="cartao__canvas"
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 3]} intensity={1.4} color="#e8e0d0" />
          <directionalLight position={[-3, -2, -2]} intensity={0.4} color="#cc1a1a" />
          <pointLight position={[0, 3, 2]} intensity={0.5} color="#fff5f0" />
          <Suspense fallback={<RosaLoader />}>
            <RosaModel />
            <Environment preset="dawn" />
          </Suspense>
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.6}
            rotateSpeed={1.0}
            minDistance={1.5}
            maxDistance={6}
          />
        </Canvas>
      </div>

      {/* Texto — coluna direita */}
      <div className="cartao__texto">
        <div className="cartao__texto-eyebrow">Mensagem</div>
        <p className="cartao__descricao">
          Espero que tenha gostado do site que fiz com muito amor.
          <br /><br />
          Apesar das brigas e das besteiras que cada um fez, eu ainda quero muito
          continuar, até porque você é a pessoa mais legal, dorminhoca, linda e
          magnífica que eu conheci e conheço.
          <br /><br />
          Adoro a sua companhia, apesar de às vezes eu só querer ficar calado ao
          seu lado. Amo o seu olhar e o seu sorriso — que devem ser direcionados
          somente a mim 😉
          <br /><br />
          Te amo. ❤️
        </p>
      </div>

      {/* Player de música — canto inferior esquerdo */}
      <div className="cartao__player">
        <div className="cartao__player-eyebrow">Nossa música</div>
        <MusicPlayer
          /* Se a música for um arquivo local na pasta public, adicione o prefixo também: */
          src={`${import.meta.env.BASE_URL}The Black Eyed Peas - Meet Me Halfway (Official Music Video) - BlackEyedPeasVEVO (youtube).mp3`}
          coverArt={`${import.meta.env.BASE_URL}black.avif`}
          autoPlay={false}
        />
      </div>

      {/* Rodapé editorial */}
      <div className="cartao__rodape">
        <span className="cartao__rodape-label">Feito com amor</span>
        <span className="cartao__rodape-label">Arraste para girar a rosa</span>
        <span className="cartao__rodape-label">Vinicius → Bianca</span>
      </div>

      {/* Cursor aura */}
      <div
        className="cartao__cursor"
        style={{ transform: `translate(${mousePos.x - 9}px, ${mousePos.y - 9}px)` }}
      />
    </div>
  );
}

export default Cartao;