import { OrbitControls, useTexture } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { Interactive, useXR } from "@react-three/xr";
import { useRef, useState } from "react";
import Model from "./Model";

const XrHitModel = () => {
  const reticleRef = useRef();
  const [models, setModels] = useState([]);
  const { isPresenting } = useXR();
  const { camera } = useThree();

  // Load the image texture for the hit marker
  const hitMarkerTexture = useTexture("/path/to/your/image.png");

  useThree(({ camera }) => {
    if (!isPresenting) {
      camera.position.z = 3;
    }
  });

  // Update reticle position to always stay in front of the camera
  useFrame(() => {
    if (reticleRef.current) {
      const distanceFromCamera = 2; // Adjust this value to control how far the marker is from the camera
      reticleRef.current.position.setFromMatrixPosition(camera.matrixWorld);
      reticleRef.current.position.add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(distanceFromCamera));
      reticleRef.current.quaternion.copy(camera.quaternion); // Align rotation with the camera
    }
  });

  const placeModel = () => {
    let position = reticleRef.current.position.clone();
    let id = Date.now();
    setModels((prevModels) => [...prevModels, { position, id }]);
  };

  return (
    <>
      <OrbitControls />
      <ambientLight />
      {isPresenting &&
        models.map(({ position, id }) => {
          return <Model key={id} position={position} />;
        })}
      {isPresenting && (
        <Interactive onSelect={placeModel}>
          <mesh ref={reticleRef}>
            {/* Replace ring geometry with a plane and apply the image texture */}
            <planeGeometry args={[0.3, 0.3]} />
            <meshBasicMaterial map={hitMarkerTexture} transparent />
          </mesh>
        </Interactive>
      )}

      {!isPresenting && <Model />}
    </>
  );
};

export default XrHitModel;
