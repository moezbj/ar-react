import * as tf from '@tensorflow/tfjs';
import { useEffect, useRef, useState } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

const HandTracking = ({ onHandDetected }) => {
  const [model, setModel] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      const detector = await handPoseDetection.createDetector(handPoseDetection.SupportedModels.MediaPipeHands, {
        runtime: 'tfjs', // Use TensorFlow.js runtime
      });
      setModel(detector);
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (!model || !videoRef.current) return;

    const video = videoRef.current;
    const detectHands = async () => {
      const predictions = await model.estimateHands(video);
      if (predictions.length > 0) {
        onHandDetected(predictions);
      } else {
        onHandDetected([]);
      }
      requestAnimationFrame(detectHands);
    };

    detectHands();
  }, [model]);

  return <video ref={videoRef} autoPlay playsInline width="640" height="480" />;
};

export default HandTracking;
