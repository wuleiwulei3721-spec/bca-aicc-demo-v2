import { useEffect, useState } from 'react'

const OPEN_EYE_CLIENT_SRC = '/screenshots/openeye-video-call.png'
const WINDOW_WIDTH = 340
const WINDOW_MARGIN = 24
const WINDOW_TOP = 92

interface DragState {
  pointerId: number
  offsetX: number
  offsetY: number
}

function getInitialPosition() {
  if (typeof window === 'undefined') {
    return {
      x: WINDOW_MARGIN,
      y: WINDOW_TOP,
    }
  }

  return {
    x: Math.max(WINDOW_MARGIN, window.innerWidth - WINDOW_WIDTH - WINDOW_MARGIN),
    y: WINDOW_TOP,
  }
}

function clampPosition(x: number, y: number) {
  if (typeof window === 'undefined') {
    return { x, y }
  }

  return {
    x: Math.min(
      Math.max(WINDOW_MARGIN, x),
      Math.max(WINDOW_MARGIN, window.innerWidth - WINDOW_WIDTH - WINDOW_MARGIN),
    ),
    y: Math.min(Math.max(WINDOW_MARGIN, y), window.innerHeight - WINDOW_MARGIN),
  }
}

export function OpenEyeVideoWindow({
  isScreenShareActive = false,
}: {
  isScreenShareActive?: boolean
}) {
  const [position, setPosition] = useState(getInitialPosition)
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
  }, [dragState])

  return (
    <div
      aria-label="OpenEye standalone video client"
      className={`openeye-video-window ${
        dragState ? 'openeye-video-window--dragging' : ''
      }`}
      role="img"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      onPointerDown={(event) => {
        event.preventDefault()
        setDragState({
          pointerId: event.pointerId,
          offsetX: event.clientX - position.x,
          offsetY: event.clientY - position.y,
        })
      }}
    >
      <div className="openeye-video-window__media">
        <img
          alt="OpenEye video call client"
          draggable={false}
          src={OPEN_EYE_CLIENT_SRC}
        />
        {isScreenShareActive ? (
          <div
            aria-label="Customer desktop share preview"
            className="openeye-video-window__screen-share"
          >
            <div className="openeye-video-window__desktop">
              <div className="openeye-video-window__desktop-sidebar" />
              <div className="openeye-video-window__desktop-content">
                <span />
                <span />
                <span />
              </div>
            </div>
            <strong>Screen Share Active</strong>
          </div>
        ) : null}
      </div>
    </div>
  )
}
