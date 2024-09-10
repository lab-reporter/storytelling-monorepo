import React, { useEffect, useState, useRef } from 'react'
import { FieldProps } from '@keystone-6/core/types'
import {
  FieldContainer,
  FieldDescription,
  FieldLabel,
} from '@keystone-ui/fields'
import { controller } from '@keystone-6/core/fields/types/json/views'
import {
  ScrollableThreeModelProps,
  CameraHelperProps,
} from '@story-telling-reporter/react-three-story-controls'
import { buttonNames } from '@story-telling-reporter/draft-editor'

const disabledButtons = [
  buttonNames.code,
  buttonNames.codeBlock,
  buttonNames.newsReading,
  buttonNames.slideshow,
  buttonNames.divider,
  buttonNames.infoBox,
  buttonNames.image,
  buttonNames.h4,
  buttonNames.h5,
]

export const Field = ({
  field,
  value,
  onChange: onFieldChange,
}: FieldProps<typeof controller>) => {
  const [cameraHelperProp, setCameraHelperProp] = useState(
    value ? JSON.parse(value) : {}
  )
  const [prevValue, setPrevValue] = useState(value)
  const [, setMounted] = useState(false)
  const CameraHelperRef = useRef<React.ComponentType<CameraHelperProps> | null>(
    null
  )

  if (value !== prevValue) {
    setPrevValue(value)
    setCameraHelperProp(value ? JSON.parse(value) : {})
  }

  useEffect(() => {
    // The reason we don't `import {CameraHelper} from '@story-telling-reporter/react-three-story-controls'`
    // at the beginning of this file is because Keystone server will fail to render the page.
    // The root cause is not clear so far.
    // Just know the error is related to Webpack.
    // Keystone uses Webpack and its related loaders, such as babel-loader, to transpile the source codes (this file).
    // But, Webpack cannot handle the import well.
    // The following is a workaround to solve this error.
    const {CameraHelper} = require('@story-telling-reporter/react-three-story-controls')  // eslint-disable-line
    CameraHelperRef.current =
      CameraHelper as React.ComponentType<CameraHelperProps>

    // force re-rendering
    setMounted(true)
  }, [])

  const Component = CameraHelperRef.current
  const modelObjs = cameraHelperProp?.modelObjs || []
  const pois = cameraHelperProp?.pois || []

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {/* @ts-ignore `FieldDescription` could recieve multiple children */}
      <FieldDescription id="camera-helper-desc">
        箭頭鍵、WASD 鍵、滑鼠滾輪或是觸控板可以前後左右移動鏡頭。 <br />
        點擊滑鼠後拖拉可以轉動鏡頭。 <br />
        U 鍵可以水平向上移動鏡頭。 <br />
        N 鍵可以水平向下移動鏡頭。 <br />
      </FieldDescription>
      <div
        style={{
          maxWidth: '50vw',
          height: '300px',
          position: 'relative',
          zIndex: '30',
        }}
      >
        {Component && (
          <Component
            modelObjs={modelObjs}
            pois={pois}
            onChange={(value) => {
              if (typeof onFieldChange === 'function') {
                const fieldData: ScrollableThreeModelProps = Object.assign(
                  {
                    modelObjs,
                  },
                  value
                )
                onFieldChange(JSON.stringify(fieldData))
              }
            }}
            disabledButtons={disabledButtons}
          />
        )}
      </div>
    </FieldContainer>
  )
}
