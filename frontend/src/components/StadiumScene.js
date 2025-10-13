import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect } from "react";

function CameraController({ targetPosition }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!targetPosition) return;

    // Blender → Three.js 좌표계 변환
    const x = targetPosition.x;
    const y = targetPosition.z + 2; 
    const z = -targetPosition.y;   

    camera.position.set(x, y, z);

    // 중심을 바라보게 
    camera.lookAt(0, 0, 0);

  }, [targetPosition, camera]);

  return null;
}


function StadiumModel() {
  const { scene } = useGLTF("/models/stadium.glb");
  return <primitive object={scene} scale={1} />;
}

export default function StadiumScene({ selectedSeat }) {
  return (
    <Canvas camera={{ position: [0, 50, 80], fov: 50 }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 20, 10]} />
      <StadiumModel />
      <CameraController targetPosition={selectedSeat} />
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
}
