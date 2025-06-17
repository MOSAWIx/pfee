import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";


function ZoomPortal({ closeZoomedImage, zoomedImage, handleImageError }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Reset zoom and position when image changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [zoomedImage]);

  // Handle click on the background to close
  const handleBackgroundClick = (e) => {
    if(!/Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)){
      closeZoomedImage();
    }
  };



  return createPortal(
    <div
      className="fixed inset-0 z-[999] bg-black bg-opacity-90 flex items-center justify-center !overflow-hidden"
      onClick={handleBackgroundClick}

  
    >
      <div 
        className="relative max-w-4xl max-h-screen p-4 overflow-hidden"
   
      >
        <div className="relative">
          <img
     
            src={zoomedImage}
            alt="Zoomed product view"
            className="max-w-full max-h-screen object-contain transition-transform cursor-move"
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transformOrigin: 'center',
            }}
            onError={handleImageError}
            draggable="false"
          />
        </div>
        

        
        <button
          className="absolute top-6 right-6  bg-white rounded-full p-2 z-10"
          onClick={closeZoomedImage}
        >
          <IoCloseOutline size={20} />
        </button>
      </div>
    </div>,
    document.getElementById("zoomPortal")
  );
}

export default ZoomPortal;
