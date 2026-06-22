# Calidad Triple A — Tienda Online

E-commerce completo para tienda de moda urbana y streetwear, desarrollado como proyecto freelance.

🔗 **[Ver en producción](https://calidad3a.com)**

## Stack tecnológico

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Zustand
- **CMS**: Sanity (gestión de productos, imágenes y contenido)
- **Emails**: Resend (emails transaccionales automáticos)
- **Deploy**: Vercel
- **Dominio y DNS**: Namecheap
- **Estilos**: CSS puro con variables y media queries

## Funcionalidades

- Catálogo dinámico con tres categorías (Ropa, Complementos, Electrónica) conectado a Sanity CMS
- Filtros por subcategoría, marca, talla, género y precio
- Ficha de producto con carrusel de imágenes y productos relacionados
- Carrito de compra con persistencia mediante Zustand
- Checkout con cálculo automático de gastos de envío por país y envío gratis a partir de 60€ en España
- Confirmación de pedido por WhatsApp con mensaje preformateado
- Email automático al vendedor con tres adjuntos: PDF del pedido, PDF de datos de envío y código QR
- Generación de PDF del pedido descargable para el cliente (jsPDF)
- SEO básico: sitemap dinámico, metadatos Open Graph, Google Search Console
- Diseño responsive adaptado a móvil, tablet y escritorio
- Vercel Web Analytics integrado

## Estructura del proyecto
app/
├── catalogo/          # Catálogo por categoría con filtros
├── producto/[id]/     # Ficha de producto dinámica
├── carrito/           # Carrito de compra
├── pedido/            # Checkout y confirmación
├── api/pedido/        # API route: email + PDF + QR
├── quienes-somos/
├── faq/
└── aviso-legal/
sanity/                # Esquemas y cliente de Sanity
store/                 # Zustand (estado del carrito)

## Aspectos destacados

- Arquitectura JAMstack con CMS headless: el cliente gestiona el catálogo de forma autónoma desde Sanity Studio sin tocar código
- Flujo de pedido completo sin pasarela de pago: WhatsApp + Bizum/PayPal gestionado manualmente, adaptado al modelo de negocio del cliente
- Generación de documentos en servidor (jsPDF + QRCode) adjuntados automáticamente al email de cada pedido
- Configuración completa de DNS, dominio, verificación de dominio en Resend y Google Search Console

## Flujo de desarrollo

El proyecto se inició en el repositorio personal [`AleeexRC/calidad-triple-a`](https://github.com/AleeexRC/calidad-triple-a), donde se desarrolló la arquitectura base y las funcionalidades principales.

Una vez listo para producción, el repositorio se migró a la cuenta del cliente (`JosepBola/calidad-triple-a`) para conectarlo con su cuenta de Vercel y realizar el despliegue real. Durante la fase de pruebas en producción — comprobando el comportamiento en móvil, distintos tamaños de pantalla y el flujo completo de pedido — los ajustes finales se hicieron directamente desde el repositorio del cliente.

El repositorio personal se mantiene sincronizado como copia de referencia para el portfolio.

---

## Autor

Desarrollado por **Alejandro Rodríguez**  
GitHub: [@ArocaDev](https://github.com/ArocaDev)
