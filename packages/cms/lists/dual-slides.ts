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

const listConfigurations = list({
  fields: {
    name: text({
      label: 'Dual Slides 名稱',
      validation: { isRequired: true },
    }),
    slides: json({
      label: '文字段落與圖片',
      defaultValue: [
        {
          content: [''],
          imgSrc: '',
        },
      ],
    }),
    embedCode: virtual({
      label: 'embed code',
      field: graphql.field({
        type: graphql.String,
        resolve: async (item: Record<string, unknown>): Promise<string> => {
          const slides = item?.slides
          const code = embedCodeGen.buildEmbeddedCode(
            'react-dual-slides',
            {
              slides,
            },
            embedCodeWebpackAssets
          )

          return code.replace(
            /(<div id=.*><\/div>)/,
            `<div class='embedded-code-container'>$1</div>`
          )
        },
      }),
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/embed-code',
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
    preview: virtual({
      field: graphql.field({
        type: graphql.JSON,
        resolve(item: Record<string, unknown>): Record<string, string> {
          return {
            href: `/demo/dual-slides/${item.id}`,
            label: 'Preview',
          }
        },
      }),
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/link-button',
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
