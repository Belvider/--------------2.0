import { ACESFilmicToneMapping, Box3, DirectionalLight, Group, HemisphereLight, Mesh, PerspectiveCamera, PMREMGenerator, Scene, Texture, Vector3, WebGLRenderer, type Material, type Object3D } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { getLearningModelAsset } from "./learning-model-assets";

export type NativeModelController = { rotate: (direction: number) => void; zoom: (factor: number) => void; reset: () => void; dispose: () => void };

function releaseObject(object: Object3D) {
  const textures = new Set<Texture>(), materials = new Set<Material>();
  object.traverse(child => {
    if (!(child instanceof Mesh)) return;
    child.geometry.dispose();
    for (const material of Array.isArray(child.material) ? child.material : [child.material]) {
      materials.add(material);
      for (const value of Object.values(material)) if (value instanceof Texture) textures.add(value);
    }
  });
  for (const texture of textures) {
    texture.dispose();
    const image = texture.source?.data as { close?: () => void } | undefined;
    image?.close?.();
  }
  for (const material of materials) material.dispose();
}

/** Imported only after activation. Assets and decoders are served by this site. */
export function mountNativeModel(host: HTMLElement, assetId: unknown, onReady: () => void, onError: () => void): NativeModelController {
  const asset = getLearningModelAsset(assetId);
  if (!asset) throw new Error("Unknown learning model asset");
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x191724);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.debug.onShaderError = () => { throw new Error("Model shader unavailable"); };
  const canvas = renderer.domElement;
  canvas.className = "h-full w-full touch-none";
  canvas.setAttribute("aria-label", `3D-модель: ${asset.title}. Обертання мишею або дотиком; кнопки керування під моделлю.`);
  canvas.setAttribute("role", "img");
  canvas.dataset.nativeReady = "false";
  host.appendChild(canvas);
  const scene = new Scene(), camera = new PerspectiveCamera(35, 1, 0.1, 30);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = false;
  const abort = new AbortController(), draco = new DRACOLoader();
  draco.setDecoderPath("/models/draco/");
  draco.setWorkerLimit(1);
  const pmrem = new PMREMGenerator(renderer), room = new RoomEnvironment();
  let environment: ReturnType<PMREMGenerator["fromScene"]> | undefined;
  let model: Object3D | undefined, disposed = false, ready = false, homeDistance = 6;
  let observer: ResizeObserver | undefined;
  const render = () => {
    if (disposed) return;
    try { renderer.render(scene, camera); }
    catch { if (!disposed) onError(); }
  };
  const onContextLost = (event: Event) => { event.preventDefault(); if (!disposed) onError(); };
  canvas.addEventListener("webglcontextlost", onContextLost);
  const reset = () => {
    if (!ready || disposed) return;
    camera.position.set(0.33, 0.05, 1).normalize().multiplyScalar(homeDistance);
    controls.target.set(0, 0, 0);
    controls.update(); render();
  };
  const resize = () => {
    if (disposed) return;
    const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
    const oldHome = homeDistance, oldDistance = controls.getDistance();
    camera.aspect = width / height;
    homeDistance = Math.max(5.8, 1.9 / Math.tan(camera.fov * Math.PI / 360) / camera.aspect);
    controls.minDistance = homeDistance * 0.42;
    controls.maxDistance = homeDistance * 2.5;
    camera.far = Math.max(30, controls.maxDistance + 6);
    renderer.setSize(width, height, false);
    camera.updateProjectionMatrix();
    if (ready) {
      camera.position.sub(controls.target).normalize().multiplyScalar(homeDistance * (oldDistance / oldHome || 1)).add(controls.target);
      controls.update(); render();
    }
  };
  controls.addEventListener("change", render);
  const timeout = window.setTimeout(() => { if (!ready && !disposed) { abort.abort(); onError(); } }, 30_000);
  void (async () => {
    try {
      environment = pmrem.fromScene(room, 0.04);
      scene.environment = environment.texture;
      scene.add(new HemisphereLight(0xffffff, 0x282335, 1.5));
      const key = new DirectionalLight(0xffffff, 2); key.position.set(4, 6, 6); scene.add(key);
      const rim = new DirectionalLight(0xffffff, 1.2); rim.position.set(-4, 1, -5); scene.add(rim);
      observer = new ResizeObserver(resize); observer.observe(host); resize();
      const response = await fetch(asset.path, { signal: abort.signal });
      if (!response.ok) throw new Error("Model asset unavailable");
      const buffer = await response.arrayBuffer();
      if (disposed) return;
      const loaded = await new GLTFLoader().setDRACOLoader(draco).parseAsync(buffer, "/models/");
      if (disposed) { releaseObject(loaded.scene); draco.dispose(); return; }
      model = loaded.scene;
      const box = new Box3().setFromObject(model), size = box.getSize(new Vector3());
      const span = Math.max(size.x, size.y, size.z);
      if (!Number.isFinite(span) || span <= 0) throw new Error("Empty model geometry");
      model.position.sub(box.getCenter(new Vector3()));
      const pivot = new Group(); pivot.add(model); pivot.scale.setScalar(3 / span); scene.add(pivot);
      ready = true; reset();
      if (disposed) return;
      canvas.dataset.nativeReady = "true";
      window.clearTimeout(timeout);
      draco.dispose();
      onReady();
    } catch {
      if (disposed) draco.dispose();
      else if (!abort.signal.aborted) onError();
    }
  })();
  return {
    rotate(direction) {
      if (!ready || disposed) return;
      camera.position.sub(controls.target).applyAxisAngle(new Vector3(0, 1, 0), direction * Math.PI / 8).add(controls.target);
      controls.update(); render();
    },
    zoom(factor) {
      if (!ready || disposed) return;
      camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target);
      controls.update(); render();
    }, reset,
    dispose() {
      if (disposed) return;
      disposed = true; abort.abort(); window.clearTimeout(timeout);
      observer?.disconnect(); controls.removeEventListener("change", render); controls.dispose();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      draco.dispose(); if (model) releaseObject(model);
      scene.environment = null; environment?.dispose(); room.dispose(); pmrem.dispose();
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    }
  };
}
