import { buildPuzzlePhotoInfraEmbedCode } from '@story-telling-reporter/react-embed-code-generator'
import { list, graphql } from '@keystone-6/core'
import {
  text,
  virtual,
  select,
  relationship,
  timestamp,
} from '@keystone-6/core/fields'
import { createdByFilter, createdByHooks } from './utils/access-control-list'

function layoutToPhotoCount(layout: string): number {
  if (!layout) return 0
  if (layout.endsWith('1')) return 1
  if (layout.endsWith('2')) return 2
  if (layout.endsWith('3')) return 3
  if (layout.endsWith('4')) return 4
  return 0
}

type LayoutSettings = {
  hasPadding?: boolean
  variant?: 'line' | 'grid'
  grid?: 'leftBig' | 'topBig' | 'uniform' | 'mixed'
  isVertical?: boolean
}

function layoutToSettings(layout: string): LayoutSettings {
  const photoCount = layoutToPhotoCount(layout)
  const prefix = layout.slice(0, 1) // 'A', 'B', ...
  switch (photoCount) {
    case 1:
      return { hasPadding: prefix === 'B' }
    case 2:
      return { isVertical: prefix === 'A' }
    case 3:
      return {
        variant: prefix === 'A' || prefix === 'B' ? 'line' : 'grid',
        isVertical: prefix === 'A',
        grid: prefix === 'C' ? 'leftBig' : 'topBig',
      }
    case 4:
      return {
        variant: 'grid',
        isVertical: prefix === 'B',
        grid: prefix === 'C' ? 'mixed' : 'uniform',
      }
    default:
      return {
        hasPadding: true,
        variant: 'line',
        isVertical: true,
      }
  }
}

const listConfigurations = list({
  fields: {
    name: text({
      label: '拼圖照片-基礎建設名稱',
      validation: { isRequired: true },
    }),
    shape: select({
      label: '尺寸',
      type: 'enum',
      options: [
        { label: '正方', value: 'square' },
        { label: '橫方', value: 'horizontalRectangle' },
        { label: '直方', value: 'verticalRectangle' },
      ],
      defaultValue: 'square',
      validation: { isRequired: true },
      ui: {
        displayMode: 'segmented-control',
      },
    }),
    layout: select({
      label: '版面',
      type: 'enum',
      options: [
        { label: '1A', value: 'A1' },
        { label: '1B', value: 'B1' },
        { label: '2A', value: 'A2' },
        { label: '2B', value: 'B2' },
        { label: '3A', value: 'A3' },
        { label: '3B', value: 'B3' },
        { label: '3C', value: 'C3' },
        { label: '3D', value: 'D3' },
        { label: '4A', value: 'A4' },
        { label: '4B', value: 'B4' },
        { label: '4C', value: 'C4' },
      ],
      defaultValue: 'A1',
      validation: { isRequired: true },
      ui: {
        displayMode: 'segmented-control',
        description: 'See layout examples: https://example.com/layout-guide',
        itemView: {
          // fieldMode: 'read',
        },
      },
    }),
    photo1: text({
      label: '第一張照片檔案URL',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({ item }) => (item?.layout ? 'edit' : 'hidden'),
        },
      },
    }),
    fitMode1: select({
      label: '第一張撐滿方式',
      options: [
        { label: 'Width', value: 'width' },
        { label: 'Height', value: 'height' },
      ],
      defaultValue: 'width',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({ item }) => (item?.layout ? 'edit' : 'hidden'),
        },
      },
    }),
    focusPosition1: select({
      label: '第一張對齊位置',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'center',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({ item }) => (item?.layout ? 'edit' : 'hidden'),
        },
      },
    }),
    photo2: text({
      label: '第二張照片檔案URL',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({ item }: { item: unknown }) => {
            const layout = (item as { layout: string }).layout
            return layoutToPhotoCount(layout) >= 2 ? 'edit' : 'hidden'
          },
        },
      },
    }),
    fitMode2: select({
      label: '第二張照片撐滿方式',
      options: [
        { label: 'Width', value: 'width' },
        { label: 'Height', value: 'height' },
      ],
      defaultValue: 'width',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({ item }: { item: unknown }) => {
            const layout = (item as { layout: string }).layout
            return layoutToPhotoCount(layout) >= 2 ? 'edit' : 'hidden'
          },
        },
      },
    }),
    focusPosition2: select({
      label: '第二張照片對齊位置',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'center',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({ item }: { item: unknown }) => {
            const layout = (item as { layout: string }).layout
            return layoutToPhotoCount(layout) >= 2 ? 'edit' : 'hidden'
          },
        },
      },
    }),
    photo3: text({
      label: '第三張照片檔案URL',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({ item }: { item: unknown }) => {
            const layout = (item as { layout: string }).layout // Type assertion to tell TypeScript it's of the correct shape
            return layoutToPhotoCount(layout) >= 3 ? 'edit' : 'hidden'
          },
        },
      },
    }),
    fitMode3: select({
      label: '第三張照片撐滿方式',
      options: [
        { label: 'Width', value: 'width' },
        { label: 'Height', value: 'height' },
      ],
      defaultValue: 'width',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({ item }: { item: unknown }) => {
            const layout = (item as { layout: string }).layout // Type assertion to tell TypeScript it's of the correct shape
            return layoutToPhotoCount(layout) >= 3 ? 'edit' : 'hidden'
          },
        },
      },
    }),
    focusPosition3: select({
      label: '第三張照片對齊位置',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'center',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({ item }: { item: unknown }) => {
            const layout = (item as { layout: string }).layout // Type assertion to tell TypeScript it's of the correct shape
            return layoutToPhotoCount(layout) >= 3 ? 'edit' : 'hidden'
          },
        },
      },
    }),
    photo4: text({
      label: '第四張照片檔案URL',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({ item }: { item: unknown }) => {
            const layout = (item as { layout: string }).layout // Type assertion to tell TypeScript it's of the correct shape
            return layoutToPhotoCount(layout) >= 4 ? 'edit' : 'hidden'
          },
        },
      },
    }),
    fitMode4: select({
      label: '第四張照片撐滿方式',
      options: [
        { label: 'Width', value: 'width' },
        { label: 'Height', value: 'height' },
      ],
      defaultValue: 'width',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({ item }: { item: unknown }) => {
            const layout = (item as { layout: string }).layout // Type assertion to tell TypeScript it's of the correct shape
            return layoutToPhotoCount(layout) >= 4 ? 'edit' : 'hidden'
          },
        },
      },
    }),
    focusPosition4: select({
      label: '第四張照片對齊位置',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'center',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({ item }: { item: unknown }) => {
            const layout = (item as { layout: string }).layout // Type assertion to tell TypeScript it's of the correct shape
            return layoutToPhotoCount(layout) >= 4 ? 'edit' : 'hidden'
          },
        },
      },
    }),
    embedCode: virtual({
      label: 'embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const layout = (item as { layout: string }).layout
          const settings = layoutToSettings(layout)
          const shape = (item as { shape: string }).shape
          const photoCount = layoutToPhotoCount(layout)
          const photoUrls = [
            item.photo1,
            item.photo2,
            item.photo3,
            item.photo4,
          ].slice(0, photoCount)
          const fitModes = [
            item.fitMode1,
            item.fitMode2,
            item.fitMode3,
            item.fitMode4,
          ].slice(0, photoCount)
          const focusPositions = [
            item.focusPosition1,
            item.focusPosition2,
            item.focusPosition3,
            item.focusPosition4,
          ].slice(0, photoCount)

          const code = buildPuzzlePhotoInfraEmbedCode({
            photoUrls: photoUrls,
            shape: shape,
            focusPositions: focusPositions,
            fitModes: fitModes,
            ...settings,
          })
          return `<!-- Puzzle Photo：${item.name} -->` + code
        },
      }),
      ui: {
        views: './lists/views/embed-code',
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
    preview: virtual({
      field: graphql.field({
        type: graphql.JSON,
        resolve(item: Record<string, unknown>): Record<string, string> {
          return {
            href: `/demo/puzzle-photo-infras/${item.id}`,
            label: '拼圖照片-基礎建設預覽',
            buttonLabel: 'Preview',
          }
        },
      }),
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/link-button',
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldPosition: 'sidebar',
        },
        listView: {
          fieldMode: 'hidden',
        },
      },
      graphql: {
        omit: {
          create: true,
          update: true,
        },
      },
    }),
    created_at: timestamp({
      label: 'Created At',
      defaultValue: { kind: 'now' },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
      },
    }),
    updated_at: timestamp({
      label: 'Updated At',
      db: {
        updatedAt: true,
      },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
      },
    }),
    created_by: relationship({
      ref: 'User',
      many: false,
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
      },
    }),
  },
  ui: {
    listView: {
      // initialSort: { field: 'id', direction: 'DESC' },
      initialColumns: ['name'],
      pageSize: 50,
    },
    labelField: 'name',
    label: '拼圖照片-基礎建設（測試版）',
  },

  access: {
    operation: () => true,
    filter: createdByFilter,
  },
  hooks: {
    resolveInput: (args) => {
      if (typeof createdByHooks.resolveInput === 'function') {
        return createdByHooks.resolveInput(args)
      }
      return args.resolvedData
    },
  },
})

export default listConfigurations
