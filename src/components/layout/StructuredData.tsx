/**
 * Structured Data (JSON-LD) component — SRS §6.1 NFR-003
 *
 * Renders a <script type="application/ld+json"> tag with the provided data.
 * Use for Schema.org structured data injection in page components.
 */

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ============================================================
// Schema.org Organization + WebSite (root layout)
// ============================================================
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Coralume",
    url: "https://coralume.vn",
    logo: "https://coralume.vn/og-image.jpg",
    description:
      "Nền tảng nhận nuôi san hô kết hợp behavioral economics + ESG. Mỗi san hô có tên riêng, được theo dõi và cập nhật ảnh/video định kỳ.",
    foundingDate: "2026",
    email: "hello@coralume.vn",
    sameAs: [
      "https://facebook.com/coralume_official",
      "https://instagram.com/coralume_official",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@coralume.vn",
      availableLanguage: ["Vietnamese", "English"],
    },
  };
}

// ============================================================
// Schema.org WebSite + SearchAction (root layout)
// ============================================================
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Coralume",
    url: "https://coralume.vn",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://coralume.vn/blog?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ============================================================
// Schema.org BreadcrumbList helper
// ============================================================
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ============================================================
// Schema.org FAQPage helper
// ============================================================
interface FAQQuestion {
  question: string;
  answer: string;
}

export function faqPageSchema(questions: FAQQuestion[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

// ============================================================
// Schema.org Product helper
// ============================================================
interface ProductSchemaInput {
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  priceMin: number;
  priceMax: number;
  currency?: string;
  category?: string;
}

export function productSchema(product: ProductSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl || "https://coralume.vn/og-image.jpg",
    url: `https://coralume.vn/san-pham#${product.slug}`,
    category: product.category || "Environmental Conservation",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.currency || "VND",
      lowPrice: product.priceMin,
      highPrice: product.priceMax,
      offerCount: 1,
      availability: "https://schema.org/InStock",
      url: `https://coralume.vn/thanh-toan?goi=${product.slug}`,
    },
  };
}
