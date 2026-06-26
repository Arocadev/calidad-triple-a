# Calidad Triple A — Tienda Online

> E-commerce completo para tienda de moda urbana y streetwear | Full e-commerce for urban fashion & streetwear store

> 🔗 [calidad3a.com](https://calidad3a.com)
---

## 🇪🇸 Español

**Calidad Triple A** es una tienda online completa desarrollada como proyecto freelance. Incluye catálogo dinámico gestionado por CMS, carrito de compra, checkout con cálculo de envíos por país, confirmación de pedido por WhatsApp y automatización de emails con PDF y código QR adjuntos.

---

### ✨ Funcionalidades

- 🛍️ **Catálogo dinámico** — tres categorías (Ropa, Complementos, Electrónica) conectadas a Sanity CMS
- 🔍 **Filtros avanzados** — subcategoría, marca, talla, género y precio
- 🖼️ **Ficha de producto** — carrusel de imágenes y productos relacionados
- 🛒 **Carrito de compra** — persistencia de estado con Zustand
- 📦 **Checkout inteligente** — cálculo automático de gastos de envío por país y envío gratis a partir de 60€ en España
- 📱 **Pedido por WhatsApp** — mensaje preformateado con todos los datos del pedido
- 📧 **Email automático al vendedor** — con tres adjuntos: PDF del pedido, PDF de datos de envío y código QR
- 📄 **PDF descargable para el cliente** — generado en tiempo real con jsPDF
- 🔎 **SEO básico** — sitemap dinámico, metadatos Open Graph, Google Search Console
- 📊 **Analytics** — Vercel Web Analytics integrado
- 📱 **Responsive** — adaptado a móvil, tablet y escritorio

---

### 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15 (App Router) + React + TypeScript |
| Estado | Zustand |
| CMS | Sanity |
| Emails | Resend |
| Generación de documentos | jsPDF + QRCode |
| Deploy | Vercel |
| Dominio y DNS | Namecheap |
| Estilos | CSS puro con variables y media queries |

---

### 📁 Estructura del proyecto

```
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
```

---

### ✅ Aspectos destacados

- Arquitectura JAMstack con CMS headless: el cliente gestiona el catálogo de forma autónoma desde Sanity Studio sin tocar código
- Flujo de pedido completo sin pasarela de pago: WhatsApp + Bizum/PayPal gestionado manualmente, adaptado al modelo de negocio del cliente
- Generación de documentos en servidor (jsPDF + QRCode) adjuntados automáticamente al email de cada pedido
- Configuración completa de DNS, dominio, verificación de dominio en Resend y Google Search Console

---

### 🔄 Flujo de desarrollo

El proyecto se inició en el repositorio personal `ArocaDev/calidad-triple-a`, donde se desarrolló la arquitectura base y las funcionalidades principales.

Una vez listo para producción, el repositorio se migró a la cuenta del cliente para conectarlo con su Vercel y realizar el despliegue real. Durante la fase de pruebas en producción los ajustes finales se hicieron directamente desde el repositorio del cliente.

El repositorio personal se mantiene sincronizado como copia de referencia para el portfolio.

---

### 🎨 Nota sobre el diseño

El diseño visual (logotipo, paleta de colores, tipografía e identidad de marca) fue definido y proporcionado por el cliente. Mi trabajo se centró en la implementación técnica, la arquitectura del proyecto y el desarrollo de todas las funcionalidades.

---

## 🌐 English

**Calidad Triple A** is a full e-commerce store built as a freelance project. It features a dynamic CMS-powered catalog, shopping cart, country-based shipping checkout, WhatsApp order confirmation and automated emails with PDF and QR code attachments.

---

### ✨ Features

- 🛍️ **Dynamic catalog** — three categories (Clothing, Accessories, Electronics) connected to Sanity CMS
- 🔍 **Advanced filters** — subcategory, brand, size, gender and price
- 🖼️ **Product page** — image carousel and related products
- 🛒 **Shopping cart** — persistent state with Zustand
- 📦 **Smart checkout** — automatic shipping cost calculation by country, free shipping over 60€ in Spain
- 📱 **WhatsApp order** — pre-formatted message with full order details
- 📧 **Automatic seller email** — with three attachments: order PDF, shipping data PDF and QR code
- 📄 **Downloadable PDF for customer** — generated in real time with jsPDF
- 🔎 **Basic SEO** — dynamic sitemap, Open Graph metadata, Google Search Console
- 📊 **Analytics** — Vercel Web Analytics integrated
- 📱 **Responsive** — adapted for mobile, tablet and desktop

---

### 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + React + TypeScript |
| State | Zustand |
| CMS | Sanity |
| Emails | Resend |
| Document generation | jsPDF + QRCode |
| Deploy | Vercel |
| Domain & DNS | Namecheap |
| Styles | Plain CSS with variables and media queries |

---

### 📁 Project Structure

```
app/
├── catalogo/          # Category catalog with filters
├── producto/[id]/     # Dynamic product page
├── carrito/           # Shopping cart
├── pedido/            # Checkout and confirmation
├── api/pedido/        # API route: email + PDF + QR
├── quienes-somos/
├── faq/
└── aviso-legal/
sanity/                # Sanity schemas and client
store/                 # Zustand (cart state)
```

---

### ✅ Highlights

- JAMstack architecture with headless CMS: the client manages the catalog autonomously from Sanity Studio without touching code
- Full order flow without payment gateway: WhatsApp + Bizum/PayPal managed manually, adapted to the client's business model
- Server-side document generation (jsPDF + QRCode) automatically attached to each order email
- Full DNS, domain, Resend domain verification and Google Search Console setup

---

### 🔄 Development flow

The project started in the personal repository `ArocaDev/calidad-triple-a`, where the base architecture and main features were built.

Once ready for production, the repository was migrated to the client's account to connect it with their Vercel and deploy to the real domain. Final adjustments during production testing were made directly from the client's repository.

The personal repository is kept in sync as a portfolio reference copy.

---

### 🎨 Design note

The visual design (logo, color palette, typography and brand identity) was defined and provided by the client. My work focused on the technical implementation, project architecture and development of all features.

---

## 👤 Autor / Author

**Alejandro Rodríguez Calabuig** — [github.com/Arocadev](https://github.com/Arocadev) · [LinkedIn](https://linkedin.com/in/alejandro-rodriguez-calabuig-a871a1230)

---

## 📄 Licencia / License

Proyecto freelance — todos los derechos del diseño pertenecen al cliente.  
Freelance project — all design rights belong to the client.
