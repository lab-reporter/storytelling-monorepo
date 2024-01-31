// @ts-ignore: no definition
import embedCodeGen from '@story-telling-reporter/react-embed-code-generator'
import { list, graphql } from '@keystone-6/core'
import { select, text, json, virtual } from '@keystone-6/core/fields'

const embedCodeWebpackAssets = embedCodeGen.loadWebpackAssets()

type EditorState = {
  videoSrc: string
  videoDuration: number
  captions: any[]
}

const listConfigurations = list({
  fields: {
    name: text({
      label: 'Scorllable Video 名稱',
      validation: { isRequired: true },
    }),
    videoSrc: text({
      label: '桌機版影片檔案 URL',
      validation: {
        isRequired: true,
      },
    }),
    mobileVideoSrc: text({
      label: '手機版影片檔案 URL',
    }),
    editorState: json({
      label: '編輯字幕',
      defaultValue: {
        captions: [],
        videoSrc: '',
        videoDuration: 0,
      },
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/scrollable-video-editor/index',
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
    theme: select({
      label: '主題色',
      options: [
        {
          label: 'Dark Mode',
          value: 'dark_mode',
        },
        {
          label: 'Light Mode',
          value: 'light_mode',
        },
      ],
      defaultValue: 'light_mode',
    }),
    embedCode: virtual({
      label: 'embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const editorState = item?.editorState as EditorState
          const darkMode = item?.theme === 'dark_mode'
          const code = embedCodeGen.buildEmbeddedCode(
            'react-scrollable-video',
            {
              video: {
                src: editorState.videoSrc,
                duration: editorState.videoDuration,
              },
              captions: editorState.captions,
              darkMode,
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
      const videoSrc = inputData?.videoSrc || inputData?.mobileVideoSrc
      if (videoSrc) {
        const editorState = Object.assign({}, item?.editorState, {
          videoSrc,
        })
        resolvedData.editorState = editorState
      }
      return resolvedData
    },
  },
})

export default listConfigurations
