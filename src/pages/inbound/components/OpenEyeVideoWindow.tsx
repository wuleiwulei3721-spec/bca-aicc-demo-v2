import { useEffect, useState } from 'react'
import type { BankAppVideoShareState } from '../../../store'

const OPEN_EYE_CLIENT_SRC =
  '/screenshots/haloapp-v18/openeye-video-call-optimized.jpg'
const HALOAPP_SHARE_VIEW_SRC =
  '/screenshots/haloapp-v18/openeye-screen-share-view-optimized.jpg'
const VIDEO_WINDOW_WIDTH = 340
const SHARE_WINDOW_WIDTH = 760
const WINDOW_MARGIN = 24
const WINDOW_TOP = 92

interface DragState {
  pointerId: number
  offsetX: number
  offsetY: number
}

function getInitialPosition(width: number, offsetY = 0) {
  if (typeof window === 'undefined') {
    return {
      x: WINDOW_MARGIN,
      y: WINDOW_TOP + offsetY,
    }
  }

  return {
    x: Math.max(WINDOW_MARGIN, window.innerWidth - width - WINDOW_MARGIN),
    y: WINDOW_TOP + offsetY,
  }
}

function getCenteredInitialPosition(width: number) {
  if (typeof window === 'undefined') {
    return {
      x: WINDOW_MARGIN,
      y: WINDOW_TOP,
    }
  }

  return {
    x: Math.max(WINDOW_MARGIN, (window.innerWidth - width) / 2),
    y: Math.max(WINDOW_MARGIN, (window.innerHeight - width * 0.68) / 2),
  }
}

function clampPosition(x: number, y: number, width: number) {
  if (typeof window === 'undefined') {
    return { x, y }
  }

  return {
    x: Math.min(
      Math.max(WINDOW_MARGIN, x),
      Math.max(WINDOW_MARGIN, window.innerWidth - width - WINDOW_MARGIN),
    ),
    y: Math.min(Math.max(WINDOW_MARGIN, y), window.innerHeight - WINDOW_MARGIN),
  }
}

function DraggableOpenEyeWindow({
  alt,
  className,
  offsetY,
  placement = 'right',
  src,
  width,
}: {
  alt: string
  className?: string
  offsetY?: number
  placement?: 'center' | 'right'
  src: string
  width: number
}) {
  const [position, setPosition] = useState(() =>
    placement === 'center'
      ? getCenteredInitialPosition(width)
      : getInitialPosition(width, offsetY),
  )
  const [dragState, setDragState] = useState<DragState | null>(null)

  useEffect(() => {
    if (!dragState) {
      return undefined
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerId !== dragState.pointerId) {
        return
      }

      setPosition(
        clampPosition(
          event.clientX - dragState.offsetX,
          event.clientY - dragState.offsetY,
          width,
        ),
      )
    }

    const stopDragging = (event: PointerEvent) => {
      if (event.pointerId === dragState.pointerId) {
        setDragState(null)
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopDragging)
    window.addEventListener('pointercancel', stopDragging)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', stopDragging)
      window.removeEventListener('pointercancel', stopDragging)
    }
  }, [dragState, width])

  return (
    <div
      aria-label={alt}
      className={[
        'openeye-video-window',
        className ?? '',
        dragState ? 'openeye-video-window--dragging' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="dialog"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      onPointerDown={(event) => {
        const target = event.target as HTMLElement

        if (target.closest('button')) {
          return
        }

        event.preventDefault()
        setDragState({
          pointerId: event.pointerId,
          offsetX: event.clientX - position.x,
          offsetY: event.clientY - position.y,
        })
      }}
    >
      <div className="openeye-video-window__media">
        <img alt={alt} draggable={false} src={src} />
      </div>
    </div>
  )
}

export function OpenEyeVideoWindow({
  bankAppVideoShareState = 'idle',
  isBankAppVideo = false,
}: {
  bankAppVideoShareState?: BankAppVideoShareState
  isBankAppVideo?: boolean
}) {
  const isBankAppShareActive =
    isBankAppVideo && bankAppVideoShareState === 'sharing'

  return (
    <>
      <DraggableOpenEyeWindow
        alt="OpenEye video call client"
        src={OPEN_EYE_CLIENT_SRC}
        width={VIDEO_WINDOW_WIDTH}
      />
      {isBankAppShareActive ? (
        <DraggableOpenEyeWindow
          alt="Customer desktop share viewed by agent"
          className="openeye-video-window--share-view"
          placement="center"
          src={HALOAPP_SHARE_VIEW_SRC}
          width={SHARE_WINDOW_WIDTH}
        />
      ) : null}
    </>
  )
}
