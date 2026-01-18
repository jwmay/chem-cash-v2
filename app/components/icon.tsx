import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-dce779a3dc/icons'

import type { SizeProp } from '@fortawesome/fontawesome-svg-core'

interface IconProps {
  className?: string
  name: string
  size?: SizeProp
}

export default function Icon({ className, name, size }: IconProps) {
  const iconStyle = 'slab' as string // 'notdog' | 'slab' | 'default'

  function getIcon(name: string, style: string = iconStyle) {
    switch (style) {
      case 'notdog':
        return byPrefixAndName.fans[name]
      case 'slab':
        return byPrefixAndName.faslr[name]
      default:
        return byPrefixAndName.faslr[name]
    }
  }

  return (
    <FontAwesomeIcon className={className} icon={getIcon(name)} size={size} />
  )
}
