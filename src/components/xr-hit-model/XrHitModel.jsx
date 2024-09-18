import { OrbitControls, useTexture } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { Interactive, useXR } from "@react-three/xr";
import { useRef, useState } from "react";
import * as THREE from "three";
import Model from "./Model";

const XrHitModel = () => {
  const reticleRef = useRef();
  const [models, setModels] = useState([]);
  const { camera } = useThree();
  const { isPresenting } = useXR();

  // Load the image texture for the hit marker
  const hitMarkerTexture = useTexture("/public/models/hand2.png");

  // Distance from the camera where the marker should stay
  const distanceFromCamera = 1;

  // Update the marker position relative to the camera's forward direction on every frame
  useFrame(() => {
    if (isPresenting && reticleRef.current) {
      // Get the camera's forward direction
      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(
        camera.quaternion
      );

      // Set the marker's position in front of the camera
      reticleRef.current.position.copy(
        camera.position.clone().add(direction.multiplyScalar(distanceFromCamera))
      );

      // Make the marker face the camera
      reticleRef.current.lookAt(camera.position);
    }
  });

  const placeModel = () => {
    let position = reticleRef.current.position.clone(); // Use the reticle's current position
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
