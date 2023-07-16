'use client'

import { useState } from 'react'

const ImgFallback = ({ src, fallback, alt, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src)

    const onError = () => {
        setImgSrc(fallback)
        fallback(null)
    }

    return (
        <img
            src={imgSrc}
            alt={''}
            onError={() => {
                setImgSrc(fallback)
            }}
            {...props}
        />
    )
}

export default ImgFallback
