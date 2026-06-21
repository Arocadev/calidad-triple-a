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
      name: 'mainCategory',
      title: 'Categoría principal',
      type: 'string',
      options: {
        list: [
          { title: 'Ropa', value: 'ropa' },
          { title: 'Complementos', value: 'complementos' },
          { title: 'Electrónica', value: 'electronica' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subCategory',
      title: 'Subcategoría',
      type: 'string',
      options: {
        list: [
          // Ropa
          { title: 'Camisetas', value: 'camisetas' },
          { title: 'Pantalones chándal cortos', value: 'pantalones_chandal_cortos' },
          { title: 'Pantalones chándal largos', value: 'pantalones_chandal_largos' },
          { title: 'Vaqueros cortos', value: 'vaqueros_cortos' },
          { title: 'Vaqueros largos', value: 'vaqueros_largos' },
          { title: 'Calzoncillos', value: 'calzoncillos' },
          { title: 'Calcetines', value: 'calcetines' },
          { title: 'Conjuntos deporte', value: 'conjuntos_deporte' },
          { title: 'Conjuntos chándal', value: 'conjuntos_chandal' },
          { title: 'Camisetas de fútbol', value: 'camisetas_futbol' },
          { title: 'Chaquetas', value: 'chaquetas' },
          { title: 'Sudaderas', value: 'sudaderas' },
          { title: 'Zapatillas', value: 'zapatillas' },
          { title: 'Sandalias y chanclas', value: 'sandalias_chanclas' },
          // Complementos
          { title: 'Carteras', value: 'carteras' },
          { title: 'Tarjeteros', value: 'tarjeteros' },
          { title: 'Gafas de sol', value: 'gafas' },
          { title: 'Gorras', value: 'gorras' },
          { title: 'Bolsos', value: 'bolsos' },
          { title: 'Bandoleras y riñoneras', value: 'bandoleras_rinoneras' },
          { title: 'Cinturones', value: 'cinturones' },
          { title: 'Relojes y joyería', value: 'relojes_joyeria' },
          // Electrónica
          { title: 'Altavoz', value: 'altavoz' },
          { title: 'Auriculares inalámbricos', value: 'auriculares' },
          { title: 'Reloj inteligente', value: 'reloj_inteligente' },
          { title: 'Bases de carga', value: 'bases_carga' },
          { title: 'Fundas de móvil', value: 'fundas_movil' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gender',
      title: 'Género',
      type: 'string',
      options: {
        list: [
          { title: 'Hombre', value: 'hombre' },
          { title: 'Mujer', value: 'mujer' },
          { title: 'Unisex', value: 'unisex' },
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
      name: 'badge',
      title: 'Etiqueta',
      type: 'string',
      options: {
        list: [
          { title: 'Ninguna', value: 'none' },
          { title: 'Nuevo', value: 'nuevo' },
          { title: 'Destacado', value: 'destacado' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
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