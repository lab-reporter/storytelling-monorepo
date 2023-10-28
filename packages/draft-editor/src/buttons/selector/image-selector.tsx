import React, { useState, useEffect, useRef } from 'react'
import debounce from 'lodash/debounce'
import styled from 'styled-components'
import { TextInput } from '@keystone-ui/fields'
import { Drawer, DrawerController } from '@keystone-ui/modals'
import { gql, useLazyQuery } from '@keystone-6/core/admin-ui/apollo'
import { AlignSelector } from './align-selector'
import { SearchBox as _SearchBox, SearchBoxOnChangeFn } from './search-box'
import { Pagination } from './pagination'

const _ = {
  debounce,
}

const SearchBox = styled(_SearchBox)`
  margin-top: 10px;
`

const MainBlock = styled.div`
  overflow: auto;
  margin-top: 10px;
`

const GridsBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  margin-top: 5px;
`

const GridBlock = styled.div`
  flex: 0 0 33.3333%;
  cursor: pointer;
  padding: 0 10px 10px;
`

const Img = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 2;
  object-fit: cover;
`

const Label = styled.label`
  display: block;
  margin: 10px 0;
  font-weight: 600;
`

const SeparationLine = styled.div`
  border: #e1e5e9 1px solid;
  margin-top: 10px;
  margin-bottom: 10px;
`

const ErrorWrapper = styled.div`
  & * {
    margin: 0;
  }
`

type ID = string

export type ImageEntity = {
  id: ID
  // `idForImageSelectorOnly` is designed for selecting one image multiple times
  idForImageSelectorOnly?: ID
  name?: string
  imageFile: {
    url: string
    width: number
    height: number
  }
  resized: {
    original: string
    tiny: string
    small: string
    medium: string
    large: string
  }
}

export type ImageEntityWithMeta = ImageEntity & {
  desc?: string
  url?: string
}

type ImageEntityOnSelectFn = (param: ImageEntity) => void

function ImageGrids(props: {
  images: ImageEntity[]
  onSelect: ImageEntityOnSelectFn
}): React.ReactElement {
  const { images, onSelect } = props

  return (
    <GridsBlock>
      {images.map((image) => {
        return (
          <GridBlock key={image.id} onClick={() => onSelect(image)}>
            <Img src={image?.imageFile?.url} />
          </GridBlock>
        )
      })}
    </GridsBlock>
  )
}

type ImageMetaOnChangeFn = (
  selectedImage: ImageEntityWithMeta,
  actionType: 'delete' | 'modify'
) => void

function ImageMetaGrids(props: {
  imageMetas: ImageEntityWithMeta[]
  onChange: ImageMetaOnChangeFn
  enableCaption: boolean
  enableDelete: boolean
}) {
  const { imageMetas, onChange, enableCaption, enableDelete } = props
  return (
    <GridsBlock>
      {imageMetas.map((imageMeta, idx) => {
        const { desc, url } = imageMeta
        return (
          <GridBlock key={idx}>
            {enableDelete && (
              <i
                onClick={() => {
                  onChange(imageMeta, 'delete')
                }}
                className="fas fa-check-circle"
              />
            )}
            <Img src={imageMeta?.imageFile?.url} />
            {enableCaption && (
              <React.Fragment>
                <Label htmlFor="caption">Image Caption:</Label>
                <TextInput
                  id="caption"
                  type="text"
                  placeholder={imageMeta?.name}
                  defaultValue={desc}
                  onChange={_.debounce((e) => {
                    onChange(
                      Object.assign({}, imageMeta, {
                        desc: e.target.value,
                        url,
                      }),
                      'modify'
                    )
                  })}
                />
              </React.Fragment>
            )}
          </GridBlock>
        )
      })}
    </GridsBlock>
  )
}

const imagesQuery = gql`
  query Photos($searchText: String!, $take: Int, $skip: Int) {
    photosCount(where: { name: { contains: $searchText } })
    photos(
      where: { name: { contains: $searchText } }
      take: $take
      skip: $skip
    ) {
      id
      name
      imageFile {
        url
        width
        height
      }
      resized {
        original
        tiny
        small
        medium
        large
      }
    }
  }
`

export type ImageSelectorOnChangeFn = (
  selectedImages: ImageEntityWithMeta[],
  alignment?: string
) => void

export function ImageSelector(props: {
  enableMultiSelect?: boolean
  enableCaption?: boolean
  enableAlignment?: boolean
  onChange: ImageSelectorOnChangeFn
  selected?: ImageEntityWithMeta[]
  alignment?: string
}) {
  const alignment = props.alignment || 'default'
  const [
    queryImages,
    {
      loading,
      error,
      data: { photos: images = [], photosCount: imagesCount = 0 } = {},
    },
  ] = useLazyQuery(imagesQuery, { fetchPolicy: 'no-cache' })
  const [currentPage, setCurrentPage] = useState(0) // page starts with 1, 0 is used to detect initialization
  const [searchText, setSearchText] = useState('')
  const [selected, setSelected] = useState<ImageEntityWithMeta[]>(
    props.selected || []
  )
  const [align, setAlign] = useState(alignment)
  const contentWrapperRef = useRef<HTMLDivElement>(null)

  const pageSize = 6

  const options = [
    { value: 'default', label: 'default', isDisabled: false },
    { value: 'paragraph-width', label: '與文章段落等寬', isDisabled: false },
    { value: 'left', label: 'left', isDisabled: false },
    { value: 'right', label: 'right', isDisabled: false },
  ]

  const {
    enableMultiSelect = false,
    enableCaption = false,
    enableAlignment = false,
    onChange,
  } = props

  const onSave = () => {
    onChange(selected, align)
  }

  const onCancel = () => {
    onChange([])
  }

  const onSearchBoxChange: SearchBoxOnChangeFn = async (searchInput) => {
    setSearchText(searchInput)
    setCurrentPage(1)
  }

  const onAlignSelectChange = (align: string) => {
    setAlign(align)
  }

  const onAlignSelectOpen = () => {
    const scrollWrapper = contentWrapperRef.current?.parentElement
    if (scrollWrapper) {
      scrollWrapper.scrollTop = scrollWrapper?.scrollHeight
    }
  }

  const changeSelectedImage: ImageMetaOnChangeFn = (
    imageEntityWithMeta,
    actionType
  ) => {
    switch (actionType) {
      case 'delete': {
        setSelected(
          selected.filter(
            (s) =>
              s.idForImageSelectorOnly !==
              imageEntityWithMeta.idForImageSelectorOnly
          )
        )
        break
      }
      case 'modify': {
        const foundIndex = selected.findIndex(
          (ele) =>
            ele.idForImageSelectorOnly ===
            imageEntityWithMeta.idForImageSelectorOnly
        )
        if (foundIndex !== -1) {
          const newSelected = [...selected]
          newSelected[foundIndex] = imageEntityWithMeta
          setSelected(newSelected)
        }
        break
      }
    }
  }

  const selectImage: ImageEntityOnSelectFn = (imageEntity) => {
    const newImageEntity = Object.assign(
      {
        // `idForImageSelectorOnly` is designed for selecting one image multiple times
        idForImageSelectorOnly: `${imageEntity.id}_${selected.length + 1}`,
        desc: '',
      },
      imageEntity
    )

    if (enableMultiSelect) {
      setSelected(selected.concat(newImageEntity))
      return
    }

    setSelected([newImageEntity])
  }

  useEffect(() => {
    if (currentPage !== 0) {
      queryImages({
        variables: {
          searchText: searchText,
          skip: (currentPage - 1) * pageSize,
          take: pageSize,
        },
      })
    }
  }, [currentPage, searchText])

  let searchResult = (
    <div>
      <ImageGrids images={images} onSelect={selectImage} />
      <Pagination
        currentPage={currentPage}
        total={imagesCount}
        pageSize={pageSize}
        onChange={(pageIndex: number) => {
          setCurrentPage(pageIndex)
        }}
      />
    </div>
  )
  if (loading) {
    searchResult = <p>searching...</p>
  }
  if (error) {
    searchResult = (
      <ErrorWrapper>
        <h3>Errors occurs in the `images` query</h3>
        <div>
          <br />
          <b>Message:</b>
          <div>{error.message}</div>
          <br />
          <b>Stack:</b>
          <div>{error.stack}</div>
          <br />
          <b>Query:</b>
          <pre>{imagesQuery.loc?.source.body}</pre>
        </div>
      </ErrorWrapper>
    )
  }

  return (
    <DrawerController isOpen={true}>
      <Drawer
        title="Select image"
        actions={{
          cancel: {
            label: 'Cancel',
            action: onCancel,
          },
          confirm: {
            label: 'Confirm',
            action: onSave,
          },
        }}
      >
        <div ref={contentWrapperRef}>
          <SearchBox onChange={onSearchBoxChange} />
          <MainBlock>
            {searchResult}
            {selected.length > 0 && <SeparationLine />}
            <ImageMetaGrids
              imageMetas={selected}
              onChange={changeSelectedImage}
              enableCaption={enableCaption}
              enableDelete={enableMultiSelect}
            />
          </MainBlock>
          {enableAlignment && (
            <AlignSelector
              align={align}
              options={options}
              onChange={onAlignSelectChange}
              onOpen={onAlignSelectOpen}
            />
          )}
        </div>
      </Drawer>
    </DrawerController>
  )
}
