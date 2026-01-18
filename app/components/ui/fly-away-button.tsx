import { cn } from '~/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  icon?: React.ReactNode
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export default function FlyAwayButton({
  children,
  onClick,
  className,
  disabled,
  icon,
  loading,
  type,
}: Props) {
  return (
    <button
      className={cn(
        'btn btn-primary btn-block btn-lg',
        className,
        'relative overflow-hidden',
        loading && 'is-loading'
      )}
      disabled={disabled || loading}
      onClick={onClick}
      type={type ?? 'button'}
    >
      {icon && (
        <span className='transition-[opacity,translate] ease-in-out duration-400 delay-200 in-[.is-loading]:opacity-0 in-[.is-loading]:translate-x-[100vw]'>
          {icon}
        </span>
      )}
      <span className='transition-opacity ease-in-out duration-200 in-[.is-loading]:opacity-0'>
        {children}
      </span>
      <span className='loading loading-dots loading-xl absolute opacity-0 transition-opacity ease-in-out duration-300 delay-300 in-[.is-loading]:opacity-100'></span>
    </button>
  )
}
