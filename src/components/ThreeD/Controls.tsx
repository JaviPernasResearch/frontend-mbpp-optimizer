import React from 'react';
import { useThree } from '@react-three/fiber';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';


const Controls = () => {
  const { camera, gl } = useThree();

  React.useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  return null;
};

export default Controls;