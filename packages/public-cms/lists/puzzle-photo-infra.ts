import {
  buildEmbedCode,
  pkgNames,
} from '@story-telling-reporter/react-embed-code-generator'
import { list, graphql } from '@keystone-6/core'
import {
  text,
  select,
  virtual,
  relationship,
  timestamp,
  json,
} from '@keystone-6/core/fields'
import { createdByFilter, createdByHooks } from './utils/access-control-list'
import type { PuzzlePhotoConfig } from './views/puzzle-photo-infra/types'

const defaultConfig: PuzzlePhotoConfig = {
  photoCount: 0,
  photos: [],
  hasPadding: true,
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
        displayMode: 'select',
      },
    }),
    direction: select({
      label: '捲動方向',
      type: 'enum',
      options: [
        { label: '橫著滾', value: 'horizontalScroll' },
        { label: '直著滾', value: 'verticalRectangleScroll' },
      ],
      defaultValue: 'horizontalScroll',
      validation: { isRequired: true },
      ui: {
        displayMode: 'select',
      },
    }),
    config: json({
      label: '方塊們',
      defaultValue: defaultConfig satisfies PuzzlePhotoConfig,
      ui: {
        views: './lists/views/puzzle-photo-infra/index',
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
    embedCode: virtual({
      label: 'embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const config = item?.config as PuzzlePhotoConfig
          const layoutSetting = {
            hasPadding: config.hasPadding,
            variant: config.variant,
            grid: config.grid,
            isVertical: config.isVertical,
          }
          const shape = item?.shape as string
          // const direction = item?.direction as string
          const photoCount = config.photoCount

          const photoUrls = config.photos
            .slice(0, photoCount)
            .map((photo) => photo.url)
          const fitModes = config.photos
            .slice(0, photoCount)
            .map((photo) => photo.fitMode)
          const focusPositions = config.photos
            .slice(0, photoCount)
            .map((photo) => photo.focusPosition)

          const code = buildEmbedCode(
            {
              id: 'puzzle-photo-' + item.id,
              photoUrls: photoUrls,
              shape: shape,
              focusPositions: focusPositions,
              fitModes: fitModes,
              ...layoutSetting,
            },
            pkgNames.puzzlePhotoInfra,
            null
          )
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
