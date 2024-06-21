import React, { useEffect, useState } from 'react'
import { getModelFileSize, loadGltfModel, GLTF } from '../loader'
import debounce from 'lodash/debounce'
import styled from '../styled-components'

const _ = {
  debounce,
}

export type GTLFModelObject = {
  url: string
  name?: string
  data?: GLTF
}

type OnModelsLoaded = (arg: GTLFModelObject[]) => void

type Props = {
  modelObjs: GTLFModelObject[]
  onModelsLoaded: OnModelsLoaded
}

const ProgressBar = styled.div`
  width: 300px;
  height: 10px;

  background-color: #fff;

  position: relative;
  overflow: hidden;
`

const LoadedBar = styled.div`
  width: 300px;
  height: 10px;

  background-color: #404040;

  position: absolute;
  top: 0;
  transform: translateX(-100%);

  transition: transform 1s linear;
`

const LoadingProgress = ({ modelObjs, onModelsLoaded }: Props) => {
  const loadingInterval = 300 //ms
  const [total, setTotal] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const fetchData = async (urls: string[]) => {
      let _total = 0
      for (const url of urls) {
        _total = _total + (await getModelFileSize(url))
      }
      return _total
    }

    fetchData(modelObjs.map((obj) => obj.url)).then(setTotal)
  }, [])

  useEffect(() => {
    const fetchData = async (modelObjs: GTLFModelObject[]) => {
      let _loaded = 0
      const promises = []
      for (const obj of modelObjs) {
        const promise = loadGltfModel(
          obj.url,
          _.debounce((progressEvent) => {
            const loaded = progressEvent.loaded
            _loaded = _loaded + loaded
            setLoaded(_loaded)
          }, loadingInterval)
        ).then((gltf) => {
          return {
            ...obj,
            data: gltf,
          } as GTLFModelObject
        })

        promises.push(promise)
      }

      return Promise.all(promises)
    }

    fetchData(modelObjs).then((_modelObjs) => {
      console.log('[react-three-hong-kong-project] all models are loaded.')
      setTimeout(() => {
        onModelsLoaded(_modelObjs)
        setFinished(true)
      }, loadingInterval)
    })
  }, [])

  if (finished) {
    return null
  }

  const loadedPct = total !== 0 ? Math.round(loaded / total) * 100 : 0

  return (
    <div>
      <ProgressBar>
        <LoadedBar style={{ transform: `translateX(${-100 + loadedPct}%)` }} />
      </ProgressBar>
      <p>loading: {loadedPct}%</p>
    </div>
  )
}

export { LoadingProgress }
