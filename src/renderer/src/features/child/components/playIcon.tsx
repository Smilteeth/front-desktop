/* ──────────── PlayIcon.tsx */
import { FC } from 'react'

interface Props {
  size?: number
  color?: string
}

const PlayIcon: FC<Props> = ({ size = 56, color = '#FEA29B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <polygon points="5,3 19,12 5,21" />
  </svg>
)

export default PlayIcon
