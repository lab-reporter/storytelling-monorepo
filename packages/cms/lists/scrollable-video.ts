// @ts-ignore: no definition
import embedCodeGen from '@story-telling-reporter/react-embed-code-generator'
import { list, graphql } from '@keystone-6/core'
import { float, select, text, json, virtual } from '@keystone-6/core/fields'
import { CaptionState } from './views/scrollable-video-editor/type'
import { customAlphabet } from 'nanoid'
import CleanCss from 'clean-css'

const nanoid = customAlphabet('abcdefghijklmnopq', 10)

const embedCodeWebpackAssets = embedCodeGen.loadWebpackAssets()

type EditorState = {
  videoSrc: string
  videoDuration: number
  captions: CaptionState[]
}

const cssSelector = '.scrollable-video.section'

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
    secondsPer100vh: float({
      label: '每滑一個視窗的高度對應影片多少秒鐘',
      defaultValue: 1.5,
      validation: {
        isRequired: true,
      },
    }),
    customCss: text({
      label: '客製化 CSS',
      defaultValue: `
/* 將捲動式影片向左移動，撐滿文章頁 */
@media (max-width: 767px) {
  .scrollable-video.container {
    margin-left: -3.4vw;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .scrollable-video.container {
    margin-left: calc((100vw - 512px)/2 * -1);
  }
}

@media (min-width: 1024px) and (max-width: 1439px) {
  .scrollable-video.container {
    margin-left: calc((100vw - 550px)/2 * -1);
  }
}

@media (min-width: 1440px) {
  .scrollable-video.container {
    margin-left: calc((100vw - 730px)/2 * -1);
  }
}

/* 覆寫所有區塊預設的 css */
${cssSelector} {
  /* 例如：background-color: pink; */
}

/* 覆寫所有區塊內圖說預設的 css */
${cssSelector} draft-image-desc {
}

/* 覆寫所有區塊內抽言預設的 css */
${cssSelector} .draft-blockquote {
}

/* 覆寫所有區塊內 H2 預設的 css */
${cssSelector} .draft-header-two {
}

/* 覆寫所有區塊內 H3 預設的 css */
${cssSelector} .draft-header-three {
}

/* 覆寫所有區塊內內文預設的 css */
${cssSelector} .draft-paragraph {
}

/* 覆寫所有區塊內超連結預設的 css */
${cssSelector} .draft-link {
}

/* 覆寫所有區塊內 annotation 預設的 css */
${cssSelector} .annotation-wrapper {
}
${cssSelector} .annotation-title {
}
${cssSelector} .annotation-body {
}
      `,
      ui: {
        displayMode: 'textarea',
      },
    }),
    embedCode: virtual({
      label: 'embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const editorState = item?.editorState as EditorState
          const darkMode = item?.theme === 'dark_mode'
          const captions = editorState.captions
          const code = embedCodeGen.buildEmbeddedCode(
            'react-scrollable-video',
            {
              video: {
                src: item?.videoSrc,
                mobileSrc: item?.mobileVideoSrc,
                duration: editorState.videoDuration,
              },
              captions: captions,
              darkMode,
              secondsPer100vh: item?.secondsPer100vh,
            },
            embedCodeWebpackAssets
          )

          const wrapperDivId = nanoid(5)
          let initialCustomCss = (item.customCss as string) ?? ''

          // To avoid css class names collision, add random unique id into css selector
          initialCustomCss = initialCustomCss.replaceAll(
            cssSelector,
            `#${wrapperDivId} ${cssSelector}`
          )

          let allCustomCss = captions.reduce((css, captionState) => {
            if (captionState.customCss) {
              return css + captionState.customCss
            }
            return css
          }, initialCustomCss)

          if (typeof allCustomCss === 'string') {
            // minify css
            allCustomCss = new CleanCss().minify(allCustomCss).styles
          }

          return `<style>${allCustomCss}</style><div id="${wrapperDivId}">${code}</div>`
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
    preview: virtual({
      field: graphql.field({
        type: graphql.JSON,
        resolve(item: Record<string, unknown>): Record<string, string> {
          return {
            href: `/demo/scrollable-videos/${item.id}`,
            label: '捲動式影片預覽',
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
      initialSort: { field: 'id', direction: 'DESC' },
      initialColumns: ['name'],
      pageSize: 50,
    },
    labelField: 'name',
  },

  access: () => true,
  hooks: {
    resolveInput: ({ inputData, item, resolvedData }) => {
      const videoSrc = inputData?.videoSrc
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
