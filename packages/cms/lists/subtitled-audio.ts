import config from '../config'
// @ts-ignore: no definition
import embedCodeGen from '@story-telling-reporter/react-embed-code-generator'
// @ts-ignore: no definition
import { list, graphql } from '@keystone-6/core'
import { text, file, virtual } from '@keystone-6/core/fields'

const embedCodeWebpackAssets = embedCodeGen.loadWebpackAssets()

const listConfigurations = list({
  fields: {
    name: text({
      label: 'SubtitledAudio 名稱',
      validation: { isRequired: true },
    }),
    audio: file({
      label: '音檔',
      storage: 'files',
    }),
    webVtt: text({
      label: '字幕（WebVTT 格式）',
      ui: {
        displayMode: 'textarea',
      },
      defaultValue: `WEBVTT

00:00:00.000 --> 00:00:02.500
我想和14歲的妳說

00:00:03.500 --> 00:00:12.500
妳經歷了很多事，有些是好事，有些的確不太好，也帶來某種難以言喻的創傷。`,
    }),
    embedCode: virtual({
      label: 'SubtitledAudio embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const audioSrc = `${config.googleCloudStorage.origin}/files/${item?.audio_filename}`

          const code = embedCodeGen.buildEmbeddedCode(
            'react-subtitled-audio',
            {
              audioUrls: [audioSrc],
              webVtt: item?.webVtt,
            },
            embedCodeWebpackAssets
          )

          return code
        },
      }),
      ui: {
        views: './lists/views/embed-code',
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
