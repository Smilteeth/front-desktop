/* ──────────── PauseIcon.tsx */
import { FC } from 'react'

interface Props {
  size?: number
  color?: string
}

const PauseIcon: FC<Props> = ({ size = 56, color = '#FDE064' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <rect x="5" y="3" width="5" height="18" rx="1" />
    <rect x="14" y="3" width="5" height="18" rx="1" />
  </svg>
)

export default PauseIcon
