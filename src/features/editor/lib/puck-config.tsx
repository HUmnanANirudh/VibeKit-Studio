import type { Config } from '@puckeditor/core'
import { Hero } from '../components/blocks/Hero'
import { Features } from '../components/blocks/Features'
import { Gallery } from '../components/blocks/Gallery'
import { Contact } from '../components/blocks/Contact'

import type { RootProps, EditorComponents as Components } from '#/types'

export const config: Config<Components, RootProps, 'layout' | 'content'> = {
  categories: {
    layout: {
      components: ['Hero', 'Features'],
    },
    content: {
      components: ['Gallery', 'Contact'],
    },
  },
  root: {
    render: ({ children, theme }) => (
      <div className="vk-editor-root min-h-screen" data-theme={theme}>
        {children}
      </div>
    ),
  },
  components: {
    Hero: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'text' },
        buttonText: { type: 'text' },
        buttonUrl: { type: 'text' },
      },
      defaultProps: {
        title: 'Hero Title',
        subtitle: 'Hero Subtitle',
        buttonText: 'Get Started',
        buttonUrl: '#',
      },
      render: (props) => <Hero {...props} />,
    },
    Features: {
      fields: {
        items: {
          type: 'array',
          getItemSummary: (item) => item.title || 'Feature Item',
          arrayFields: {
            title: { type: 'text' },
            description: { type: 'textarea' },
          },
        },
      },
      defaultProps: {
        items: [
          { title: 'Feature One', description: 'Description one' },
          { title: 'Feature Two', description: 'Description two' },
        ],
      },
      render: (props) => <Features {...props} />,
    },
    Gallery: {
      fields: {
        images: {
          type: 'array',
          getItemSummary: (item) => item.alt || 'Gallery Image',
          arrayFields: {
            url: { type: 'text' },
            alt: { type: 'text' },
          },
        },
      },
      defaultProps: {
        images: [
          { url: 'https://picsum.photos/seed/p1/800/600', alt: 'Image 1' },
          { url: 'https://picsum.photos/seed/p2/800/600', alt: 'Image 2' },
        ],
      },
      render: (props) => <Gallery {...props} />,
    },
    Contact: {
      fields: {
        heading: { type: 'text' },
        subheading: { type: 'text' },
      },
      defaultProps: {
        heading: 'Contact Us',
        subheading: 'We are here to help.',
      },
      render: (props) => <Contact {...props} />,
    },
  },
}
