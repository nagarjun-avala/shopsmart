"use client";
import Image from "next/image";
import { useState } from "react";

interface AppImageProps {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
}

function AppImage({ src, width = 50, height = 50, alt = "Image", className = "", ...props }: AppImageProps) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            onError={() => setImgSrc("/assets/images/no_image.png")}
            {...props}
        />
    );
}

export default AppImage;
