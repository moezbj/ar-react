import { useFrame } from "@react-three/fiber";
import { Interactive } from "@react-three/xr";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const CenteredPlane = () => {
  const planeRef = useRef();
  const distanceFromCamera = 1;
  const [currentImage, setCurrentImage] = useState("/models/hand2.png");

  const texture1 = useTexture("/models/hand2.png");
  const texture2 = useTexture("/models/henna.png");

  const handleClick = () => {
    setCurrentImage((prevImage) =>
      prevImage === "/models/hand2.png"
        ? "/models/henna.png"
        : "/models/hand2.png"
    );
  };

  useFrame(({ camera }) => {
    if (planeRef.current) {
      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(
        camera.quaternion
      );
      planeRef.current.position.copy(
        camera.position
          .clone()
          .add(direction.multiplyScalar(distanceFromCamera))
      );
      planeRef.current.lookAt(camera.position);
    }
  });

  return (
    <Interactive onSelect={handleClick}>
      <mesh ref={planeRef}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial
          map={currentImage === "/models/hand2.png" ? texture1 : texture2}
          transparent={true}
        />
      </mesh>
    </Interactive>
  );
};
export default CenteredPlane;
