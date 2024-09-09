import { graphql, list } from '@keystone-6/core'
import { text, json, relationship, virtual } from '@keystone-6/core/fields'
import { buildScrollableThreeModelEmbedCode } from '@story-telling-reporter/react-embed-code-generator'
import { ScrollableThreeModelProps } from '@story-telling-reporter/react-three-story-controls'
import { createdByFilter, createdByHooks } from './utils/access-control-list'

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
        views: './lists/views/scrollable-three-model/index',
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
          const data = item?.cameraHelperData as ScrollableThreeModelProps
          const { modelObjs, pois, animationClip } = data
          const poisWithoutImg = pois?.map((poi) => {
            const { image, ...rest } = poi // eslint-disable-line
            return { ...rest }
          })
          const code = buildScrollableThreeModelEmbedCode({
            modelObjs,
            pois: poisWithoutImg,
            animationClip,
          })

          return `<!-- 捲動式 3D 模型：${item.name} -->` + code
        },
      }),
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/embed-code',
        createView: {
          fieldMode: 'hidden',
        },
        listView: {
          fieldMode: 'hidden',
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
      initialSort: { field: 'id', direction: 'DESC' },
      initialColumns: ['name'],
      pageSize: 50,
    },
    labelField: 'name',
    label: '捲動式3D',
  },
  access: {
    operation: () => true,
    filter: createdByFilter,
  },
  hooks: {
    resolveInput: (args) => {
      let { resolvedData } = args
      const { inputData, item } = args

      if (typeof createdByHooks.resolveInput === 'function') {
        resolvedData = createdByHooks.resolveInput(args)
      }

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
