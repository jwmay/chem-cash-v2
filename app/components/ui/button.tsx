import React from 'react'
import { cn } from '~/lib/utils'

interface ButtonProps {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({
  children,
  className,
  disabled,
  type,
}: ButtonProps) {
  return (
    <button
      className={cn('btn btn-primary btn-block btn-lg', className)}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}
