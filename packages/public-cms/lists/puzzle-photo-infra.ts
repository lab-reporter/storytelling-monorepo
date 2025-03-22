import { buildPuzzlePhotoInfraEmbedCode } from '@story-telling-reporter/react-embed-code-generator'
import { list, graphql } from '@keystone-6/core'
import { text, virtual, select } from '@keystone-6/core/fields'
import { createdByHooks } from './utils/access-control-list'

const layoutToPhotoCount = (layoutValue: string) => {
  const layout = layoutValue.split('_')
  const photoCount = layout[layout.length - 1]
  return Number(photoCount)
}

const listConfigurations = list({
  fields: {
    name: text({
      label: '拼圖照片-基礎建設名稱',
      validation: { isRequired: true },
    }),
    size: select({
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
        { label: '1A', value: 'LAYOUT_A_1' },
        { label: '1B', value: 'LAYOUT_B_1' },
        { label: '2A', value: 'LAYOUT_A_2' },
        { label: '2B', value: 'LAYOUT_B_2' },
        { label: '3A', value: 'LAYOUT_A_3' },
        { label: '3B', value: 'LAYOUT_B_3' },
        { label: '3C', value: 'LAYOUT_C_3' },
        { label: '3D', value: 'LAYOUT_D_3' },
        { label: '4A', value: 'LAYOUT_A_4' },
        { label: '4B', value: 'LAYOUT_B_4' },
        { label: '4C', value: 'LAYOUT_C_4' },
      ],
      defaultValue: 'LAYOUT_A_1',
      validation: { isRequired: true },
      ui: {
        displayMode: 'segmented-control',
        description: 'See layout examples: https://example.com/layout-guide',
        itemView: {
          fieldMode: 'read',
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
    photo2: text({
      label: '第二張照片檔案URL',
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({ item }: { item: unknown }) => {
            const layout = (item as { layout: string }).layout // Type assertion to tell TypeScript it's of the correct shape
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
    embedCode: virtual({
      label: 'embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const photoSrc = [item.photo1, item.photo2, item.photo3, item.photo4]
          const code = buildPuzzlePhotoInfraEmbedCode({
            id: 'puzzle-photo-infra',
            size: 'square',
            layout: 'square',
            photoUrls: photoSrc,
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
    // filter: createdByFilter,
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
