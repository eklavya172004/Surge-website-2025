import Image from 'next/image'
import React from 'react'
import timer from './../../public/Timer.png'

const Timer = () => {
  return (
    <section className="relative bg-white w-full h-screen"> {/* full screen container */}

    
    <div className='bg-white'>
      <Image
        src={timer}
        alt="timer"
        fill
        priority
        className="bg-white" // makes it cover fully
        />

      <div className="absolute inset-0 flex items-center justify-center">
        {/* Add any content you want on top of the bg */}
        <h1 className="text-white text-4xl font-bold">Timer Page</h1>
      </div>
        </div>
    </section>
  )
}

export default Timer
