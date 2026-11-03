import { useEffect, useRef } from "react";
import * as THREE from "three";

// SVG icon glyphs — drawn as canvas sprites that orbit the sphere
const ICON_PATHS = [
  // simplified heart, plus, stethoscope, syringe, pill, dna, building, monitor
  "M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z",
  "M12 5v14M5 12h14",
  "M6 3v6a4 4 0 0 0 8 0V3M10 13v4a3 3 0 1 0 6 0v-2",
  "M11 8l5 5M3 21l4-4M14 6l4 4-2 2-4-4z",
  "M10 4l10 10-3 3a7 7 0 0 1-10-10z",
  "M4 4c4 4 12 12 16 16M4 20c4-4 12-12 16-16",
  "M3 21h18M5 21V7l7-4 7 4v14M9 9h2v2H9zM13 9h2v2h-2zM9 13h2v2H9zM13 13h2v2h-2z",
  "M3 4h18v12H3zM7 20h10M12 16v4",
];

const makeIconTexture = (path, color = "#4A90E2") => {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.beginPath(); ctx.arc(64, 64, 56, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 6; ctx.lineJoin = "round"; ctx.lineCap = "round";
  ctx.translate(64, 64); ctx.scale(3.6, 3.6); ctx.translate(-12, -12);
  const p = new Path2D(path); ctx.stroke(p);
  return new THREE.CanvasTexture(c);
}; 

const Hero3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current; if (!mount) return;
    const w = mount.clientWidth, h = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100); camera.position.z = 5.4;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(w, h); mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 2),
      new THREE.MeshBasicMaterial({ color: 0x3fb549, wireframe: true, transparent: true, opacity: 0.55 }));
    const outer = new THREE.Mesh(new THREE.IcosahedronGeometry(1.95, 1),
      new THREE.MeshBasicMaterial({ color: 0x4a90e2, wireframe: true, transparent: true, opacity: 0.35 }));
    group.add(inner, outer); scene.add(group);

    // Orbiting icons
    const iconGroup = new THREE.Group();
    const icons = ICON_PATHS.map((p, i) => {
      const tex = makeIconTexture(p, i % 2 === 0 ? "#4A90E2" : "#3FB549");
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.95 });
      const sp = new THREE.Sprite(mat); sp.scale.set(0.5, 0.5, 1);
      const theta = (i / ICON_PATHS.length) * Math.PI * 2;
      sp.userData = { theta, radius: 2.6, speed: 0.25 + (i % 3) * 0.05, tilt: ((i % 4) - 1.5) * 0.4 };
      iconGroup.add(sp); return sp;
    });
    scene.add(iconGroup);

    // Particles
    const count = 320, positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.9 + Math.random() * 1.2, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(p) * Math.cos(t);
      positions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      positions[i * 3 + 2] = r * Math.cos(p);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(geom, new THREE.PointsMaterial({ size: 0.04, color: 0x4a90e2, transparent: true, opacity: 0.85, sizeAttenuation: true }));
    scene.add(points);

    const clock = new THREE.Clock();
    let raf;
    const animate = () => {
      const dt = clock.getDelta(), t = clock.getElapsedTime();
      group.rotation.y += dt * 0.18; group.rotation.x += dt * 0.04;
      points.rotation.y += dt * 0.06;
      icons.forEach((sp) => {
        const u = sp.userData;
        const a = u.theta + t * u.speed;
        sp.position.set(Math.cos(a) * u.radius, Math.sin(a) * u.radius * 0.6 + Math.sin(t + u.theta) * 0.25 + u.tilt, Math.sin(a) * u.radius * 0.4);
        sp.material.opacity = 0.55 + 0.4 * (Math.sin(t * 2 + u.theta) * 0.5 + 0.5);
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const ww = mount.clientWidth, hh = mount.clientHeight;
      camera.aspect = ww / hh; camera.updateProjectionMatrix(); renderer.setSize(ww, hh);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf); window.removeEventListener("resize", onResize);
      renderer.dispose(); inner.geometry.dispose(); outer.geometry.dispose();
      icons.forEach((sp) => { sp.material.map?.dispose(); sp.material.dispose(); });
      geom.dispose(); points.material.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-0 pointer-events-none" data-testid="hero-3d"/>;
};

export default Hero3D;
