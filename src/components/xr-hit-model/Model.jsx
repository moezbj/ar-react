/* import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/druid.gltf");
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={1.91}>
        <primitive object={nodes.root} />
        <skinnedMesh
          geometry={nodes.druid.geometry}
          material={materials.color_main}
          skeleton={nodes.druid.skeleton}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/druid.gltf"); */

// import { useLoader } from "@react-three/fiber";
// import { Suspense } from "react";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// const Model = ({ position }) => {
//   const gltf = useLoader(GLTFLoader, "/models/druid.gltf");
//   return (
//     <Suspense fallback={null}>
//       <primitive position={position} object={gltf.scene} />
//     </Suspense>
//   );
// };

// export default Model;
import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function Model(props) {
  const imageRef = useRef();
  const texture = useLoader(THREE.TextureLoader, "/models/henna.png");

  useEffect(() => {
    if (texture) {
      const aspectRatio = texture.image.width / texture.image.height;
      const planeWidth = 1; // Set this to the desired width
      const planeHeight = planeWidth / aspectRatio;
      // Adjust the plane geometry to the image aspect ratio
      imageRef.current.geometry.dispose(); // Dispose the old geometry
      imageRef.current.geometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight
      );
    }
  }, [texture]);
  // const { nodes, materials, animations } = useGLTF("/models/druid.gltf");
  // const { actions } = useAnimations(animations, group);
  return (
    <mesh ref={imageRef}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
