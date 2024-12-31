import React from 'react'
import DualImageUpload from './DualImageUpload'

function TwoCam() {
  return (
    <div>
        <div className='flex justify-center'>
            <div className='text-4xl'>Two Cam View</div>
        </div>
            <DualImageUpload path={'/btwocam'} />
    </div>
  )
}

export default TwoCam