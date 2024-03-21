import config from '../config'
import { buildSubtitledAudioEmbedCode } from '@story-telling-reporter/react-embed-code-generator'
import { list, graphql } from '@keystone-6/core'
import { text, file, virtual } from '@keystone-6/core/fields'

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
    hintText: text({
      label: '聲音提示文字',
      defaultValue: '本文有金句聲音元件，\n聽聽作者想和14歲的自己說什麼？',
      ui: {
        displayMode: 'textarea',
      },
    }),
    embedCode: virtual({
      label: 'SubtitledAudio embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const audioSrc = `${config.gcs.urlPrefix}/files/${item?.audio_filename}`

          const code = buildSubtitledAudioEmbedCode({
            audioUrls: [audioSrc],
            webVtt: item?.webVtt,
            hintText: item?.hintText,
          })

          return `<!-- 聲音金句字幕版： ${item.name} -->` + code
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
