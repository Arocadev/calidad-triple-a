import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Precio (€)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'images',
      title: 'Imágenes',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.min(1).error('Añade al menos una imagen'),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Zapatillas', value: 'zapatillas' },
          { title: 'Camisetas', value: 'camisetas' },
          { title: 'Gorras', value: 'gorras' },
          { title: 'Complementos', value: 'complementos' },
          { title: 'Electrónica', value: 'electronica' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gender',
      title: 'Género',
      type: 'string',
      options: {
        list: [
          { title: 'Masculino', value: 'masculino' },
          { title: 'Femenino', value: 'femenino' },
          { title: 'Ambos', value: 'ambos' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'brand',
      title: 'Marca',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sizes',
      title: 'Tallas y stock',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'sizeEntry',
          title: 'Talla',
          fields: [
            defineField({
              name: 'size',
              title: 'Talla',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'stock',
              title: 'Stock',
              type: 'number',
              initialValue: 0,
              validation: (Rule) => Rule.required().min(0).integer(),
            }),
          ],
          preview: {
            select: { title: 'size', subtitle: 'stock' },
            prepare({ title, subtitle }) {
              return {
                title: `Talla ${title}`,
                subtitle: subtitle === 0 ? 'Sin stock' : `${subtitle} uds.`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Destacado en Home',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'brand',
      media: 'images.0',
    },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media }
    },
  },
  orderings: [
    {
      title: 'Nombre A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Precio ↑',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'Precio ↓',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
  ],
})