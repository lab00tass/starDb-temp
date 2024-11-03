import Image from 'next/image';
import React from 'react';

const RiverView = ({ images }) => {
  return (
    <div className="w-full h-auto columns-2 lg:columns-4 gap-4">
      {images.map((image, index) => (
        <div key={index} className="w-full h-auto mb-4">
          <Image src={image.imageThumb} alt={`image-${index}`} width={600} height={400} className="w-full h-auto object-cover" />
        </div>
      ))}
    </div>
  );
};

export default RiverView;
