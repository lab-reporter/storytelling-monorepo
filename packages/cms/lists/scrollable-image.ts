import { list } from '@keystone-6/core'
import { text, json } from '@keystone-6/core/fields'

const listConfigurations = list({
  fields: {
    name: text({
      label: 'Scorllable Image 名稱',
      validation: { isRequired: true },
    }),
    editorState: json({
      label: '編輯圖片和字幕',
      defaultValue: {
        captions: [],
        imgObjs: [],
      },
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/scrollable-image-editor/index',
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
  },
  ui: {
    listView: {
      initialSort: { field: 'id', direction: 'DESC' },
      initialColumns: ['name'],
      pageSize: 50,
    },
    labelField: 'name',
  },

  access: () => true,
  hooks: {},
})

export default listConfigurations
