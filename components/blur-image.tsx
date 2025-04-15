"use client"
import Image from 'next/image';
import { useState } from 'react';
import { cn } from "@/lib/utils";

interface BlurImageProps extends React.ComponentProps<typeof Image> {
  alt: string;
}

export function BlurImage({ className, alt, ...props }: BlurImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      {...props}
      alt={alt}
      className={cn(
        className,
        'duration-700 ease-in-out rounded-lg',
        isLoading
          ? 'grayscale blur-2xl scale-110'
          : 'grayscale-0 blur-0 scale-100'
      )}
      onLoadingComplete={() => setLoading(false)}
    />
  );
} 