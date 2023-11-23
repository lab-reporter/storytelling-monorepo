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

type VideoType = {
  sources: {
    src: string
    mediaType: string
  }[]
}

type EditorState = {
  video: VideoType
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
        captions: [],
        video: {
          sources: [
            {
              mediaType: 'video/mp4',
              src: '',
            },
          ],
        },
      },
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/scrollable-video-editor',
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
          const video: VideoType = {
            sources: [],
          }
          if (videoUrl) {
            video.sources.push({
              src: videoUrl,
              mediaType: 'video/mp4',
            })
          }
          if (mobileVideoUrl) {
            video.sources.push({
              src: mobileVideoUrl,
              mediaType: 'video/mp4',
            })
          }
          const code = embedCodeGen.buildEmbeddedCode(
            'react-scrollable-video',
            {
              video,
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
      const videoUrl = inputData?.videoUrl
      if (videoUrl) {
        const editorState = Object.assign({}, item?.editorState, {
          video: {
            sources: [
              {
                mediaType: 'video/mp4',
                src: inputData.videoUrl,
              },
            ],
          },
        })
        resolvedData.editorState = editorState
      }
      return resolvedData
    },
  },
})

export default listConfigurations
