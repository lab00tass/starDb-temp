import React from 'react';
import { Image } from 'antd';

const GridView = ({ images }) => {
  return (
    <Image.PreviewGroup
      preview={{
        onChange: (current, prev) => console.log(`Current index: ${current}, Previous index: ${prev}`),
        
      }}
    >
      <div className="w-full h-auto columns-2 lg:columns-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="w-auto aspect-square mb-4">
            <Image 
              src={image.imageThumb} 
              alt={`image-${index}`} 
              width={200} 
              height={200} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        ))}
      </div>
    </Image.PreviewGroup>
  );
};

export default GridView;
