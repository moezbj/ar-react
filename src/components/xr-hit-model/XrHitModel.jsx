/* import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import { useRef, useState } from "react";
import Model from "./Model"; 

const XrHitModel = () => {
  const reticleRef = useRef();
  const [models, setModels] = useState([]);

  const { isPresenting } = useXR();

  useThree(({ camera }) => {
    if (!isPresenting) {
      camera.position.z = 3;
    }
  });

  useHitTest((hitMatrix, hit) => {
     hitMatrix.decompose(
      reticleRef.current.position,
      reticleRef.current.quaternion,
      reticleRef.current.scale
    );

    reticleRef.current.rotation.set(-Math.PI / 2, 0, 0); 
    reticleRef.current.position.clone().add(offset);
    reticleRef.current.rotation.copy(camera.rotation);
  });

  const placeModel = (e) => {
    let position = e.intersection.object.position.clone();
    let id = Date.now();
    setModels([{ position, id }]);
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
          <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.1, 0.25, 32]} />
            <meshStandardMaterial color={"white"} />
          </mesh>
        </Interactive>
      )}

      {!isPresenting && <Model />}
    </>
  );
};

export default XrHitModel;*/
import { Canvas, useFrame } from "@react-three/fiber";
import { XR, ARButton } from "@react-three/xr";
import { useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";


const CenteredPlane = () => {
  const planeRef = useRef();
  const distanceFromCamera = 1; // The distance from the camera where the plane should stay
  const texture = useTexture("/public/models/hand2.png"); // Load your image as a texture

  useFrame(({ camera }) => {
    if (planeRef.current) {
      // Get the forward direction of the camera
      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(
        camera.quaternion
      );

      // Position the plane in front of the camera
      planeRef.current.position.copy(
        camera.position
          .clone()
          .add(direction.multiplyScalar(distanceFromCamera))
      );

      // Ensure the plane always faces the camera
      planeRef.current.lookAt(camera.position);
    }
  });

  return (
    <mesh ref={planeRef}>
      {/* Simple plane geometry */}
      <planeGeometry args={[0.5, 0.5]} />
      <meshBasicMaterial map={texture} transparent={true} />
    </mesh>
  );
};
export default CenteredPlane;
