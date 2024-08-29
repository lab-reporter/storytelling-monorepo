import React, { useEffect, useRef } from 'react'
import { DeleteMarkIcon, EditMarkIcon, MarkIcon } from './styled'
import { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;

  svg {
    width: 40px;
  }

  svg:nth-child(2) {
    position: absolute;
    width: 40px;
    height: 40px;
    bottom: -20px;
    left: 0px;
  }
`

export function CaptionMark({
  className,
  captionIdx,
  onEdit,
  onRemove,
}: {
  className?: string
  captionIdx: number
  onEdit: (captionIdx: number) => void
  onRemove: (captionIdx: number) => void
}) {
  const [editMode, setEditMode] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (editMode) {
          setEditMode(false)
        }
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef, editMode])

  const iconsJsx = editMode ? (
    <>
      <EditMarkIcon
        onClick={() => {
          onEdit(captionIdx)
        }}
      />
      <DeleteMarkIcon
        onClick={() => {
          onRemove(captionIdx)
        }}
      />
    </>
  ) : (
    <MarkIcon
      onClick={() => {
        setEditMode(true)
      }}
    />
  )

  return (
    <Container className={className} ref={wrapperRef}>
      {iconsJsx}
    </Container>
  )
}
