import React, { useCallback, useState } from 'react'
import { FieldProps } from '@keystone-6/core/types'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'
import { controller } from '@keystone-6/core/fields/types/json/views'

type LayoutOption =
  | 'A1'
  | 'B1'
  | 'A2'
  | 'B2'
  | 'A3'
  | 'B3'
  | 'C3'
  | 'D3'
  | 'A4'
  | 'B4'
  | 'C4'

type DirectionOption = 'horizontal' | 'vertical'
type LayoutValue = LayoutOption | ''

type PuzzlePhotoEditorProps = {
  shape: 'square' | 'horizontalRectangle' | 'verticalRectangle'
  direction: DirectionOption
  layout: LayoutValue
  photoUrls: string[]
  fitModes: ('width' | 'height')[]
  focusPositions: ('left' | 'center' | 'right')[]
}

type IconSpec = {
  cols: string
  rows: string
  cells: { col: string; row: string; inset?: number }[]
}

const layoutOptions: LayoutOption[] = [
  'A1',
  'B1',
  'A2',
  'B2',
  'A3',
  'B3',
  'C3',
  'D3',
  'A4',
  'B4',
  'C4',
]

const iconSpecs: Record<LayoutOption, IconSpec> = {
  A1: {
    cols: '1fr',
    rows: '1fr',
    cells: [{ col: '1 / 2', row: '1 / 2' }],
  },
  B1: {
    cols: '1fr',
    rows: '1fr',
    cells: [{ col: '1 / 2', row: '1 / 2', inset: 4 }],
  },
  A2: {
    cols: '1fr',
    rows: '1fr 1fr',
    cells: [
      { col: '1 / 2', row: '1 / 2' },
      { col: '1 / 2', row: '2 / 3' },
    ],
  },
  B2: {
    cols: '1fr 1fr',
    rows: '1fr',
    cells: [
      { col: '1 / 2', row: '1 / 2' },
      { col: '2 / 3', row: '1 / 2' },
    ],
  },
  A3: {
    cols: '1fr',
    rows: '1fr 1fr 1fr',
    cells: [
      { col: '1 / 2', row: '1 / 2' },
      { col: '1 / 2', row: '2 / 3' },
      { col: '1 / 2', row: '3 / 4' },
    ],
  },
  B3: {
    cols: '1fr 1fr 1fr',
    rows: '1fr',
    cells: [
      { col: '1 / 2', row: '1 / 2' },
      { col: '2 / 3', row: '1 / 2' },
      { col: '3 / 4', row: '1 / 2' },
    ],
  },
  C3: {
    cols: '2fr 1fr',
    rows: '1fr 1fr',
    cells: [
      { col: '1 / 2', row: '1 / 3' },
      { col: '2 / 3', row: '1 / 2' },
      { col: '2 / 3', row: '2 / 3' },
    ],
  },
  D3: {
    cols: '1fr 1fr',
    rows: '2fr 1fr',
    cells: [
      { col: '1 / 3', row: '1 / 2' },
      { col: '1 / 2', row: '2 / 3' },
      { col: '2 / 3', row: '2 / 3' },
    ],
  },
  A4: {
    cols: '1fr 1fr',
    rows: '1fr 1fr',
    cells: [
      { col: '1 / 2', row: '1 / 2' },
      { col: '2 / 3', row: '1 / 2' },
      { col: '1 / 2', row: '2 / 3' },
      { col: '2 / 3', row: '2 / 3' },
    ],
  },
  B4: {
    cols: '1fr 1fr',
    rows: '1fr 1fr',
    cells: [
      { col: '1 / 2', row: '1 / 2' },
      { col: '2 / 3', row: '1 / 2' },
      { col: '1 / 2', row: '2 / 3' },
      { col: '2 / 3', row: '2 / 3' },
    ],
  },
  C4: {
    cols: '2fr 1fr',
    rows: '2fr 1fr',
    cells: [
      { col: '1 / 2', row: '1 / 2' },
      { col: '2 / 3', row: '1 / 2' },
      { col: '1 / 2', row: '2 / 3' },
      { col: '2 / 3', row: '2 / 3' },
    ],
  },
}

const defaultConfig: PuzzlePhotoEditorProps = {
  shape: 'square',
  direction: 'horizontal',
  layout: '',
  photoUrls: [],
  fitModes: [],
  focusPositions: [],
}

function layoutToPhotoCount(layout: LayoutValue): number {
  if (!layout) return 0
  if (layout.endsWith('1')) return 1
  if (layout.endsWith('2')) return 2
  if (layout.endsWith('3')) return 3
  if (layout.endsWith('4')) return 4
  return 0
}

function normalizeArray<T>(
  items: T[] | undefined,
  count: number,
  fill: T
): T[] {
  const safeItems = Array.isArray(items) ? items.slice(0, count) : []
  while (safeItems.length < count) {
    safeItems.push(fill)
  }
  return safeItems
}

function parseConfigValue(
  value: FieldProps<typeof controller>['value']
): PuzzlePhotoEditorProps {
  if (!value) {
    return defaultConfig
  }
  if (typeof value === 'string') {
    try {
      return {
        ...defaultConfig,
        ...(JSON.parse(value) as PuzzlePhotoEditorProps),
      }
    } catch (error) {
      return defaultConfig
    }
  }
  if (typeof value === 'object') {
    return { ...defaultConfig, ...(value as PuzzlePhotoEditorProps) }
  }
  return defaultConfig
}

function normalizeConfig(
  config: PuzzlePhotoEditorProps
): PuzzlePhotoEditorProps {
  const photoCount = layoutToPhotoCount(config.layout)
  return {
    ...config,
    photoUrls: normalizeArray(config.photoUrls, photoCount, ''),
    fitModes: normalizeArray(config.fitModes, photoCount, 'width'),
    focusPositions: normalizeArray(config.focusPositions, photoCount, 'center'),
  }
}

function LayoutIcon({
  layout,
  selected,
}: {
  layout: LayoutOption
  selected: boolean
}) {
  const spec = iconSpecs[layout]
  return (
    <div
      style={{
        position: 'relative',
        width: '54px',
        height: '54px',
        padding: '6px',
        borderRadius: '8px',
        border: selected ? '2px solid #111827' : '1px solid #d8dde3',
        background: '#fff',
        display: 'grid',
        gap: '3px',
        gridTemplateColumns: spec.cols,
        gridTemplateRows: spec.rows,
        boxSizing: 'border-box',
      }}
    >
      {spec.cells.map((cell, index) => (
        <div
          key={`${layout}-${index}`}
          style={{
            gridColumn: cell.col,
            gridRow: cell.row,
            background: '#f2f4f7',
            border: '1px solid #e1e5ea',
            borderRadius: '3px',
            margin: cell.inset ? `${cell.inset}px` : 0,
          }}
        />
      ))}
      {selected ? (
        <span
          style={{
            position: 'absolute',
            left: '9px',
            top: '11px',
            width: '16px',
            height: '10px',
            borderLeft: '3px solid #111827',
            borderBottom: '3px solid #111827',
            transform: 'rotate(-45deg)',
          }}
        />
      ) : null}
    </div>
  )
}

function LayoutPreview({
  layout,
  shape,
}: {
  layout: LayoutOption
  shape: PuzzlePhotoEditorProps['shape']
}) {
  const spec = iconSpecs[layout]
  const aspectRatio =
    shape === 'horizontalRectangle'
      ? '16 / 9'
      : shape === 'verticalRectangle'
      ? '9 / 16'
      : '1 / 1'

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '420px',
        aspectRatio,
        background: '#3b3b3b',
        borderRadius: '10px',
        padding: '16px',
        boxSizing: 'border-box',
        display: 'grid',
        gap: '8px',
        gridTemplateColumns: spec.cols,
        gridTemplateRows: spec.rows,
      }}
    >
      {spec.cells.map((cell, index) => (
        <div
          key={`${layout}-preview-${index}`}
          style={{
            gridColumn: cell.col,
            gridRow: cell.row,
            background: '#6b7280',
            borderRadius: '6px',
            border: '1px solid #9ca3af',
            margin: cell.inset ? `${cell.inset}px` : 0,
          }}
        />
      ))}
    </div>
  )
}

export const Field = ({
  field,
  value,
  onChange: onFieldChange,
}: FieldProps<typeof controller>) => {
  const [config, setConfig] = useState<PuzzlePhotoEditorProps>(() =>
    normalizeConfig(parseConfigValue(value))
  )
  const [prevValue, setPrevValue] = useState(value)
  const [isLayoutPickerOpen, setIsLayoutPickerOpen] = useState(false)

  if (value !== prevValue) {
    const nextConfig = normalizeConfig(parseConfigValue(value))
    setPrevValue(value)
    setConfig(nextConfig)
  }

  const updateConfig = useCallback(
    (nextConfig: PuzzlePhotoEditorProps) => {
      setConfig(nextConfig)
      onFieldChange?.(JSON.stringify(nextConfig))
    },
    [onFieldChange]
  )

  const handleLayoutChange = useCallback(
    (layout: LayoutOption) => {
      const updated = normalizeConfig({ ...config, layout })
      updateConfig(updated)
      setIsLayoutPickerOpen(false)
    },
    [config, updateConfig]
  )

  const handleLayoutPickerOpen = useCallback(() => {
    setIsLayoutPickerOpen(true)
  }, [])

  const handleShapeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      updateConfig({
        ...config,
        shape: event.target.value as PuzzlePhotoEditorProps['shape'],
      })
    },
    [config, updateConfig]
  )

  const handleDirectionChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      updateConfig({
        ...config,
        direction: event.target.value as DirectionOption,
      })
    },
    [config, updateConfig]
  )

  return (
    <FieldContainer>
      <div style={{ display: 'grid', gap: '16px', maxWidth: '720px' }}>
        <section>
          <div style={{ fontWeight: 600, marginBottom: '8px' }}>方塊尺寸</div>
          <select
            value={config.shape}
            onChange={handleShapeChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#fff',
            }}
          >
            <option value="square">正方</option>
            <option value="horizontalRectangle">橫方</option>
            <option value="verticalRectangle">直方</option>
          </select>
        </section>

        <section>
          <div style={{ fontWeight: 600, marginBottom: '8px' }}>捲動方向</div>
          <select
            value={config.direction}
            onChange={handleDirectionChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#fff',
            }}
          >
            <option value="horizontal">橫著滾</option>
            <option value="vertical">直著滾</option>
          </select>
        </section>

        <section>
          <FieldLabel>{field.label}</FieldLabel>
          <div
            style={{
              position: 'relative',
              background: '#303030',
              borderRadius: '10px',
              padding: '18px',
              overflow: 'hidden',
              minHeight: '220px',
            }}
          >
            {isLayoutPickerOpen ? (
              <div
                style={{
                  display: 'grid',
                  gap: '12px',
                  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                }}
              >
                {layoutOptions.map((layout) => (
                  <button
                    key={layout}
                    type="button"
                    onClick={() => handleLayoutChange(layout)}
                    aria-label={`Layout ${layout}`}
                    style={{
                      border: '10px',
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <LayoutIcon
                      layout={layout}
                      selected={config.layout === layout}
                    />
                  </button>
                ))}
              </div>
            ) : config.layout ? (
              <LayoutPreview layout={config.layout} shape={config.shape} />
            ) : null}
            <button
              type="button"
              aria-label="Select layout"
              onClick={handleLayoutPickerOpen}
              style={{
                position: 'absolute',
                left: '12px',
                bottom: '12px',
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: '#1f1f1f',
                border: '1px solid #3a3a3a',
                color: '#d1d5db',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        </section>
      </div>
    </FieldContainer>
  )
}
