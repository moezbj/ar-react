import { useEffect, useRef, useState } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { loadGraphModel } from '@tensorflow/tfjs';

const handDetectionModelUrl = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@0.0.3/hand_pose_detection_model.json'; // Update with your model URL

const HandTracking = ({ onHandDetected }) => {
  const [model, setModel] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      const model = await loadGraphModel(handDetectionModelUrl);
      setModel(model);
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (!model || !videoRef.current) return;

    const video = videoRef.current;
    const detectHands = async () => {
      const predictions = await model.estimateHands(video);
      if (predictions.length > 0) {
        // Hand detected
        onHandDetected(predictions);
      } else {
        // No hand detected
        onHandDetected([]);
      }
      requestAnimationFrame(detectHands);
    };

    detectHands();
  }, [model]);

  return <video ref={videoRef} autoPlay playsInline width="640" height="480" />;
};

export default HandTracking;
