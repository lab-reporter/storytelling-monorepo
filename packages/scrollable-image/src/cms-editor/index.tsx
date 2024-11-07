import React, { useState } from 'react'
import styled from '../styled-components'
import {
  AddButton as _AddButton,
  DeleteButton,
  SwitchPrevButton,
  SwitchNextButton,
  ZoomInButton as _ZoomInButton,
  // ZoomOutButton as _ZoomOutButton
} from './styled'
import { Drawer, DrawerController, DrawerProvider } from '@keystone-ui/modals'
import { FieldLabel, TextInput } from '@keystone-ui/fields'
import { ImgObj } from '../type'

const Container = styled.div``

const CardsContainer = styled.div`
  width: 100%;
  overflow: scroll;

  position: relative;

  > div:last-child {
    position: sticky;
    bottom: 15px;
    left: 30px;
  }
`

const ZoomInButton = styled(_ZoomInButton)`
  width: 50px;
  height: 50px;
`

const AddButton = styled(_AddButton)`
  width: 50px;
  height: 50px;
`

const Panel = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 30px;
`

const Cards = styled.div`
  display: flex;
  width: fit-content;
  min-width: 110vw;
  height: 300px;
  flex-wrap: nowrap;
`

const Card = styled.div`
  width: fit-content;
`

const CardImg = styled.img`
  height: 260px;
`

const CardPanel = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
  gap: 6px;
`

export function ScrollableImageEditor() {
  const [imgObjs, setImgObjs] = useState<ImgObj[]>([])

  const cards = imgObjs.map((imgObj, idx) => {
    return (
      <Card key={idx}>
        <CardImg src={imgObj.url} />
        <CardPanel>
          <span>{`${idx + 1}`.padStart(3, '00')}</span>
          <SwitchNextButton
            disabled={idx === imgObjs.length - 1}
            onClick={() => {
              // switch the target image with the previous one
              const previousImg = imgObjs.slice(idx - 1, idx)[0]
              if (previousImg) {
                const currentImg = imgObjs.slice(idx, idx + 1)[0]
                const newImgObjs = [
                  ...imgObjs.slice(0, idx - 1),
                  currentImg,
                  previousImg,
                  ...imgObjs.slice(idx + 1, imgObjs.length),
                ]
                setImgObjs(newImgObjs)
              }
            }}
          />
          <SwitchPrevButton
            disabled={idx === 0}
            onClick={() => {
              // switch the target image with the next one
              const nextImg = imgObjs.slice(idx + 1, idx + 2)[0]
              if (nextImg) {
                const currentImg = imgObjs.slice(idx, idx + 1)[0]
                const newImgObjs = [
                  ...imgObjs.slice(0, idx),
                  nextImg,
                  currentImg,
                  ...imgObjs.slice(idx + 2, imgObjs.length),
                ]
                setImgObjs(newImgObjs)
              }
            }}
          />
          <DeleteButton
            onClick={() => {
              // delete the image
              const newImgObjs = [
                ...imgObjs.slice(0, idx),
                ...imgObjs.slice(idx + 1, imgObjs.length),
              ]

              setImgObjs(newImgObjs)
            }}
          />
        </CardPanel>
      </Card>
    )
  })
  return (
    <Container>
      <CardsContainer>
        <Cards>{cards}</Cards>
        <Panel>
          <ZoomInButton />
          <AddImageButton
            onChange={(imgUrl) => {
              const newImgObjs = imgObjs.concat([
                {
                  url: imgUrl,
                },
              ])
              setImgObjs(newImgObjs)
            }}
          />
          <div>新增文字區塊</div>
        </Panel>
      </CardsContainer>
    </Container>
  )
}

export function AddImageButton({
  className,
  onChange,
}: {
  className?: string
  onChange: (url: string) => void
}) {
  const [toShowInput, setToShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  return (
    <React.Fragment>
      {toShowInput && (
        <DrawerProvider>
          <DrawerController isOpen={toShowInput}>
            <Drawer
              width="wide"
              title={`照片`}
              actions={{
                cancel: {
                  label: 'Cancel',
                  action: () => {
                    setToShowInput(false)
                  },
                },
                confirm: {
                  label: 'Confirm',
                  action: () => {
                    onChange(inputValue)
                    setToShowInput(false)
                  },
                },
              }}
            >
              <MarginTop />
              <FieldLabel>檔案URL</FieldLabel>
              <TextInput
                onChange={(e) => {
                  const url = e.target.value
                  setInputValue(url)
                }}
                type="text"
              />
            </Drawer>
          </DrawerController>
        </DrawerProvider>
      )}
      <AddButton
        className={className}
        onClick={() => {
          setToShowInput(true)
        }}
      />
    </React.Fragment>
  )
}

const MarginTop = styled.div`
  margin-top: 30px;
`
