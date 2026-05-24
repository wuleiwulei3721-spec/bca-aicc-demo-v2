import { useEffect, useState } from 'react'
import type { BankAppVideoShareState } from '../../../store'

const OPEN_EYE_CLIENT_SRC = '/screenshots/openeye-video-call.png'
const OPEN_EYE_SHARE_SELECTION_SRC = '/screenshots/openeye-share-selection.png'
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
  bankAppVideoShareState = 'idle',
  isBankAppVideo = false,
  isScreenShareActive = false,
  onConfirmScreenShare,
  onStartScreenShare,
}: {
  bankAppVideoShareState?: BankAppVideoShareState
  isBankAppVideo?: boolean
  isScreenShareActive?: boolean
  onConfirmScreenShare?: () => void
  onStartScreenShare?: () => void
}) {
  const [position, setPosition] = useState(getInitialPosition)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const isSelectingShareProgram =
    isBankAppVideo && bankAppVideoShareState === 'selecting-program'

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
        <img
          alt="OpenEye video call client"
          draggable={false}
          src={
            isSelectingShareProgram
              ? OPEN_EYE_SHARE_SELECTION_SRC
              : OPEN_EYE_CLIENT_SRC
          }
        />
        {isBankAppVideo && bankAppVideoShareState === 'idle' ? (
          <button
            aria-label="Start desktop sharing"
            className="openeye-video-window__share-button"
            type="button"
            onClick={onStartScreenShare}
          >
            Desktop Share
          </button>
        ) : null}
        {isSelectingShareProgram ? (
          <button
            aria-label="Confirm selected sharing program"
            className="openeye-video-window__share-confirm-hotspot"
            type="button"
            onClick={onConfirmScreenShare}
          />
        ) : null}
        {isScreenShareActive && !isBankAppVideo ? (
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
