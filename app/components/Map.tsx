import React from 'react'
import Image from 'next/image'

const Map = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col">
           <div className="md:mt-50 mt-20 text-black ml-[40px] text-5xl sm:text-6xl md:text-8xl text-left mb-4" style={{ fontFamily: 'Anton', fontWeight: 100 }}>
          EVENT MAP
        </div>

        <div className="w-full">
          <Image
            src="/map.png"   // files in public folder are served from root
            alt="Event map"
            width={1200}
            height={800}
            className="w-[90%] m-auto  h-auto max-w-none"
          />
        </div>
      </div>
    </div>
  )
}

export default Map