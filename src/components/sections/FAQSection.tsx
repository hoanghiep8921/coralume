'use client';

import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { faqItems } from '@/data/products';

/**
 * FR-024: FAQ Accordion Section
 *
 * 5 questions with expand/collapse using CSS grid-template-rows animation.
 * Single-open pattern (only one answer visible at a time).
 * WCAG 2.1 AA: aria-expanded, aria-controls, role=region, keyboard nav.
 */
export function FAQSection() {
  const { ref, isInView } = useInView(0.1, '-50px');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      ref={ref}
      className="py-[var(--spacing-stack-lg)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto"
    >
      {/* Section Header */}
      <div
        className={`text-center mb-12 transition-all duration-slow ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
        }`}
      >
        <h2 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">
          Câu hỏi thường gặp
        </h2>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Mọi thắc mắc về chương trình nhận nuôi san hô Coralume.
        </p>
      </div>

      {/* Accordion */}
      <div
        className={`max-w-3xl mx-auto space-y-2 transition-all duration-slow ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
        }`}
      >
        {faqItems.map((faq) => {
          const isExpanded = expandedId === faq.id;
          const panelId = `faq-panel-${faq.id}`;

          return (
            <div
              key={faq.id}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden"
            >
              {/* Toggle button */}
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle(faq.id);
                  }
                }}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                className="w-full flex justify-between items-center gap-4 px-6 py-4 text-left font-body-lg font-medium text-on-surface hover:bg-surface-container-low transition-colors duration-fast"
              >
                <span>{faq.question}</span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-on-surface-variant transition-transform duration-normal ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Answer panel with grid-template-rows animation */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={faq.id}
                className={`grid transition-[grid-template-rows] duration-normal ease-out-expo ${
                  isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-4">
                    <p className="font-body-md text-on-surface-variant leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
