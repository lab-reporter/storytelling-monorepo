// @ts-ignore: no definition
import embedCodeGen from '@story-telling-reporter/react-embed-code-generator'
import { list, graphql } from '@keystone-6/core'
import {
  // checkbox,
  // relationship,
  text,
  json,
  virtual,
} from '@keystone-6/core/fields'

const embedCodeWebpackAssets = embedCodeGen.loadWebpackAssets()

type EditorState = {
  videoObj: {
    src: string
    type: string
  }
  captions: any[]
}

const listConfigurations = list({
  fields: {
    name: text({
      label: 'Scorllable Video 名稱',
      validation: { isRequired: true },
    }),
    videoUrl: text({
      label: '桌機版影片檔案 URL',
      validation: {
        isRequired: true,
      },
    }),
    mobileVideoUrl: text({
      label: '手機版影片檔案 URL',
    }),
    editorState: json({
      label: '編輯字幕',
      defaultValue: {
        duration: 0,
        captions: [],
        videoObj: {
          src: '',
          type: 'video/mp4',
        },
      },
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/scrollable-video-editor/index',
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
          const editorState = item?.editorState as EditorState
          const captions = editorState?.captions || []
          const videoUrl = item?.videoUrl as string
          const mobileVideoUrl = item?.mobileVideoUrl as string
          const videoObj = {
            src: '',
          }
          if (videoUrl) {
            videoObj.src = videoUrl
          } else if (mobileVideoUrl) {
            videoObj.src = mobileVideoUrl
          }
          const code = embedCodeGen.buildEmbeddedCode(
            'react-scrollable-video',
            {
              videoObj,
              captions,
            },
            embedCodeWebpackAssets
          )

          return code
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
      const videoUrl = inputData?.videoUrl || inputData?.mobileVideoUrl
      if (videoUrl) {
        const editorState = Object.assign({}, item?.editorState, {
          videoObj: {
            src: inputData.videoUrl,
          },
        })
        resolvedData.editorState = editorState
      }
      return resolvedData
    },
  },
})

export default listConfigurations
