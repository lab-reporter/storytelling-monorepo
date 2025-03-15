// import { } from '@story-telling-reporter/react-embed-code-generator'
import { list } from '@keystone-6/core'
import { text, select } from '@keystone-6/core/fields'
// import { createdByFilter, createdByHooks } from './utils/access-control-list'

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
    photot1: text({
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
    photot2: text({
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
    photot3: text({
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
    photot4: text({
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
})

export default listConfigurations
