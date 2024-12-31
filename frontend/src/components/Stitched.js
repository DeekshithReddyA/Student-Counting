import React from 'react'
import ImageUpload from './ImageUpload'

function Stitched() {
  return (
    <div>
        <div className='flex justify-center'>
            <div className='text-3xl'>Stitched Image</div>
        </div>
        <ImageUpload path={'/bstitched'}/>
    </div>
  )
}

export default Stitched