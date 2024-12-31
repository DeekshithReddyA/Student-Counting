import React from 'react'
import ImageUpload from './ImageUpload';

function OneCam() {
  return (
    <div>
        <div className='flex justify-center'>
            <div className='text-4xl'>One Cam View</div>
        </div>
        <ImageUpload path={`/bonecam`}/>
    </div>
  )
}

export default OneCam;