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

export default XrHitModel; */

import { OrbitControls, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import { useRef, useState } from "react";
import * as THREE from "three";
import Model from "./Model";

const XrHitModel = () => {
  const reticleRef = useRef();
  const [models, setModels] = useState([]);
  const { isPresenting } = useXR();

  // Load the image texture for the hit marker
  const hitMarkerTexture = useTexture("/models/hand2.png");

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
  /*   const direction = new THREE.Vector3(); // Create it once

    direction.set(0, 0, -1).applyQuaternion(camera.quaternion);
    reticleRef.current.position.copy(
      camera.position.clone().add(direction.multiplyScalar(distanceFromCamera))
    );

    reticleRef.current.lookAt(camera.position); */
  });

  const placeModel = (e) => {
    let position = e.intersection.object.position.clone();
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
          <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
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

/* import { Canvas } from "@react-three/fiber";
import { XR, ARButton, useXR } from "@react-three/xr";
import { OrbitControls, useTexture } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { Interactive } from "@react-three/xr";
import { useRef, useState } from "react";
import * as THREE from "three";
import Model from "./Model"; // Assuming you have a Model component

const XrHitModel = () => {
  const reticleRef = useRef();
  const [models, setModels] = useState([]);
  const { camera } = useThree();
  const { isPresenting } = useXR();

  // Load the image texture for the hit marker
  const hitMarkerTexture = useTexture("/models/hand.png");

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
        camera.position
          .clone()
          .add(direction.multiplyScalar(distanceFromCamera))
      );

      // Make the marker face the camera
      reticleRef.current.lookAt(camera.position);
    }
  });
  let n = new THREE.Vector3(); // normal - for re-use
  let cpp = new THREE.Vector3(); //coplanar point - for re-use
  let plane = new THREE.Plane();

  let objPos = object.position;
  let camPos = camera.position;

  // somewhere in animation loop or anywhere else further
  n.subVectors(camPos, objPos).normalize();
  cpp.copy(objPos);
  plane.setFromNormalAndCoplanarPoint(n, cpp);

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
            <planeGeometry args={[0.3, 0.3]} />
            <meshBasicMaterial map={hitMarkerTexture} transparent />
          </mesh>
        </Interactive>
      )}

      {!isPresenting && <Model />}
    </>
  );
};
export default XrHitModel; */
