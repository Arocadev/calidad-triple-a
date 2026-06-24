# Calidad Triple A — Tienda Online

E-commerce completo de moda urbana y streetwear desarrollado como proyecto freelance, con catálogo dinámico, gestión de pedidos automatizada y una arquitectura basada en CMS headless.

🔗 **Ver en producción:** [www.calidad3a.com](https://www.calidad3a.com/)

## Stack tecnológico

### Frontend

* Next.js 15 (App Router)
* React
* TypeScript
* Zustand (gestión del estado global del carrito)

### CMS

* Sanity (gestión de productos, imágenes y contenido)

### Servicios externos

* Resend (emails transaccionales)
* Vercel (despliegue y hosting)
* Namecheap (dominio y configuración DNS)

### Estilos

* CSS puro con variables CSS y media queries para diseño responsive

---

## ✨ Funcionalidades

### Catálogo de productos

* Catálogo dinámico conectado a Sanity CMS.
* Tres categorías principales:

  * Ropa
  * Complementos
  * Electrónica
* Sistema de filtros por subcategoría, marca, talla, género y precio.
* Página de producto con galería de imágenes y productos relacionados.

### Carrito y checkout

* Carrito persistente utilizando Zustand.
* Cálculo automático de gastos de envío según el país.
* Envío gratuito a partir de 60€ en España.
* Confirmación del pedido mediante WhatsApp con mensaje preformateado.

### Gestión automatizada de pedidos

* Envío automático de un email al vendedor con:

  * PDF con el resumen del pedido.
  * PDF con los datos de envío.
  * Código QR generado automáticamente.
* Generación y descarga del PDF del pedido para el cliente mediante jsPDF.

### SEO y analítica

* Sitemap dinámico.
* Metadatos Open Graph.
* Integración con Google Search Console.
* Vercel Web Analytics.

### Experiencia de usuario

* Diseño completamente responsive adaptado a móvil, tablet y escritorio.

---

## Estructura del proyecto

```bash
app/
├── catalogo/          # Catálogo con filtros
├── producto/[id]/     # Página de producto dinámica
├── carrito/           # Gestión del carrito
├── pedido/            # Checkout y confirmación
├── api/pedido/        # API Route: emails, PDF y QR
├── quienes-somos/
├── faq/
└── aviso-legal/

sanity/
├── schemas/           # Esquemas de contenido
└── lib/               # Cliente y configuración de Sanity

store/
└── cartStore.ts       # Estado global con Zustand
```

## Arquitectura y aspectos destacados

* Arquitectura JAMstack con CMS Headless, permitiendo al cliente gestionar el catálogo desde Sanity Studio sin modificar código.
* Flujo de compra personalizado sin pasarela de pago tradicional, utilizando WhatsApp y pagos mediante Bizum o PayPal adaptados al modelo de negocio.
* Generación de documentos en servidor con jsPDF y QRCode, adjuntados automáticamente en los emails de cada pedido.
* Configuración completa de dominio, DNS, despliegue en Vercel, verificación de dominio en Resend e integración con Google Search Console.

---

## Flujo de desarrollo

El proyecto comenzó en el repositorio personal **ArocaDev/calidad-triple-a**, donde se diseñó la arquitectura inicial y se desarrollaron las funcionalidades principales.

Una vez preparado para producción, el repositorio se migró a la cuenta del cliente **JosepBola/calidad-triple-a** para conectarlo con su infraestructura de Vercel y realizar el despliegue en producción.

Durante la fase de pruebas se realizaron ajustes finales relacionados con la adaptación a distintos dispositivos, tamaños de pantalla y validación completa del flujo de pedido.

El repositorio personal se mantiene sincronizado como copia de referencia para el portfolio.

---

## Nota sobre el diseño

El diseño visual del proyecto (logotipo, paleta de colores, tipografía e identidad de marca) fue proporcionado por el cliente.

Mi trabajo se centró en la arquitectura del proyecto, desarrollo de funcionalidades, integración de servicios externos y puesta en producción del e-commerce.

---

## Autor

Desarrollado por **Alejandro Rodríguez**

GitHub: **@ArocaDev**
