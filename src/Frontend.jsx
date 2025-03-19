import React, { useState, useRef, useEffect, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ORIGINAL_IMAGE_WIDTH = 500;
const ORIGINAL_IMAGE_HEIGHT = 500;

const detectionResults = [
  { x1: 121, y1: 4, x2: 163, y2: 45, label: "Circular_RBC" },
  { x1: 396, y1: 312, x2: 433, y2: 353, label: "Circular_RBC" },
];

export default function WSIViewer() {
  const [selected, setSelected] = useState(null);
  const imgRef = useRef(null);
  const [imgSize, setImgSize] = useState({ width: 1, height: 1 });

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      const updateSize = () => {
        setImgSize({ width: img.clientWidth, height: img.clientHeight });
      };
      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  const getScaledBoxStyle = useCallback(
    (det) => {
      const scaleX = imgSize.width / ORIGINAL_IMAGE_WIDTH;
      const scaleY = imgSize.height / ORIGINAL_IMAGE_HEIGHT;
      return {
        left: `${det.x1 * scaleX}px`,
        top: `${det.y1 * scaleY}px`,
        width: `${(det.x2 - det.x1) * scaleX}px`,
        height: `${(det.y2 - det.y1) * scaleY}px`,
      };
    },
    [imgSize]
  );

  const getBoxClassName = (index) =>
    `absolute border-2 transition ${
      selected === index ? "border-red-500" : "border-yellow-300"
    }`;

  return (
    <div className="flex h-screen p-4 gap-4">
      {/* Left Panel */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-auto">
        <h2 className="text-xl font-bold mb-4">Findings</h2>
        <ul>
          {detectionResults.map((det, index) => (
            <li
              key={index}
              className="cursor-pointer p-2 hover:bg-gray-200"
              onClick={() => setSelected(index)}
            >
              {det.label} ({det.x1}, {det.y1})
            </li>
          ))}
        </ul>
      </div>

      {/* Main Viewer */}
      <div className="flex-grow relative border">
        <TransformWrapper minScale={0.5} maxScale={3}>
          <TransformComponent>
            <div className="relative">
              <img
                ref={imgRef}
                src="/7_20241209_024613.png"
                alt="WSI"
                className="w-full h-auto object-cover"
              />
              {detectionResults.map((det, index) => (
                <div
                  key={index}
                  className={getBoxClassName(index)}
                  style={getScaledBoxStyle(det)}
                  onClick={() => setSelected(index)}
                  role="button"
                  aria-pressed={selected === index}
                />
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}
