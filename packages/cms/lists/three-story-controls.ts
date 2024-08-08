import { list } from '@keystone-6/core'
import { text, json } from '@keystone-6/core/fields'

const listConfigurations = list({
  fields: {
    name: text({
      label: 'Three Story Points 名稱',
      validation: { isRequired: true },
    }),
    modelSrc: text({
      label: '3D model 檔案 URL（必須是 .gltf 或是 .glb 格式）',
      validation: {
        isRequired: true,
      },
    }),
    cameraHelperData: json({
      label: '鏡頭移動軌跡與字幕',
      defaultValue: { plainPois: [], animationClip: null, modelObjs: [] },
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/three-story-controls/index',
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
  hooks: {
    resolveInput: ({ inputData, item, resolvedData }) => {
      const modelSrc = inputData?.modelSrc
      if (modelSrc) {
        const cameraHelperData = Object.assign(
          // default value
          {
            modelObjs: [],
            plainPois: [],
            animationClip: null,
          },
          item?.cameraHelperData,
          {
            modelObjs: [
              {
                url: modelSrc,
              },
            ],
          }
        )
        resolvedData.cameraHelperData = cameraHelperData
      }
      return resolvedData
    },
  },
})

export default listConfigurations
