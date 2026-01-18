import React from 'react'
import logoSrc from '~/assets/logos/chem-cash-logo.png'
import logoPrimeSrc from '~/assets/logos/chem-cash-prime-logo.png'

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  prime?: boolean
}

export default function Logo({ prime, ...props }: LogoProps) {
  return (
    <img
      alt={`Chem Cash ${prime && 'Prime '}Logo`}
      src={prime ? logoPrimeSrc : logoSrc}
      {...props}
    />
  )
}
