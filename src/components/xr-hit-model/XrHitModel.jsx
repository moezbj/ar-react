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

export default XrHitModel;
 */
import { OrbitControls, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Interactive, useXR } from "@react-three/xr";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import Model from "./Model";

const XrHitModel = () => {
  const reticleRef = useRef();
  const [models, setModels] = useState([]);
  const { camera } = useThree();
  const { isPresenting } = useXR();

  // Load the image texture for the hit marker
  const hitMarkerTexture = useTexture("/models/hand2.png");

  // Position the marker directly in front of the camera
  useEffect(() => {
    if (isPresenting && reticleRef.current) {
      const distanceFromCamera = 1; // Distance of marker from the camera

      // Update the position on every frame
      const updateMarkerPosition = () => {
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(
          camera.quaternion
        );
        reticleRef.current.position.copy(
          camera.position.clone().add(direction.multiplyScalar(distanceFromCamera))
        );
        reticleRef.current.lookAt(camera.position);
      };

      // Listen to the frame updates
      const unsubscribe = useThree(({ gl }) => {
        gl.setAnimationLoop(updateMarkerPosition);
      });

      // Cleanup when the component unmounts
      return () => {
        unsubscribe();
      };
    }
  }, [camera, isPresenting]);

  const placeModel = (e) => {
    let position = reticleRef.current.position.clone(); // Use the reticle's position
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
