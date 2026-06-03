'use client';

/**
 * FR-003: How It Works — "Your Stewardship Journey" from Stitch
 *
 * 2-column layout (desktop):
 * - Left: 3 steps with numbered circles
 * - Right: Image + testimonial card overlay
 *
 * Mobile: Single column stacked
 */
export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Select Your Coral',
      description:
        'Browse our active nursery beds and choose a specimen that resonates with you. Each coral has a unique biological profile.',
    },
    {
      number: '02',
      title: 'Name & Dedicate',
      description:
        'Make it personal. Give your coral a name and dedicate it to a loved one or a significant moment in your life.',
    },
    {
      number: '03',
      title: 'Track Personal Growth',
      description:
        'Receive quarterly 3D scans and high-resolution growth reports of your specific coral, directly from our Nha Trang divers.',
    },
  ];

  return (
    <section className="bg-surface-container py-[var(--spacing-stack-lg)] md:py-32 px-[var(--spacing-margin-desktop)]">
      <div className="max-w-[var(--spacing-container-max)] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Left: Steps */}
        <div>
          <span className="text-secondary font-label-sm uppercase tracking-widest mb-2 block">
            The Experience
          </span>
          <h2 className="font-heading-serif text-display-lg-mobile md:text-display-lg text-primary mb-8">
            Your Stewardship Journey
          </h2>
          <div className="space-y-12">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 group">
                {/* Number Circle */}
                <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-fast">
                  <span className="font-mono text-primary group-hover:text-white">{step.number}</span>
                </div>
                {/* Content */}
                <div>
                  <h3 className="font-headline-md text-primary mb-2">{step.title}</h3>
                  <p className="text-on-surface-variant font-body-md">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image + Testimonial */}
        <div className="relative">
          {/* Image Placeholder */}
          <div className="aspect-[4/5] rounded-3xl overflow-hidden premium-shadow bg-primary-fixed-dim/20 flex items-center justify-center">
            <div className="text-center p-8">
              <span className="material-symbols-outlined text-tertiary text-6xl mb-4" aria-hidden="true">
                image
              </span>
              <p className="text-on-surface-variant text-sm">
                Ảnh underwater — Đang chờ CLB cung cấp
              </p>
            </div>
          </div>

          {/* Testimonial Card Overlay */}
          <div className="absolute -bottom-4 md:-bottom-8 -left-0 md:-left-8 bg-surface-container-lowest p-6 rounded-2xl premium-shadow border border-surface-container max-w-xs">
            <p className="text-secondary font-label-sm uppercase mb-2">Live Update</p>
            <p className="font-heading-serif italic text-primary">
              &ldquo;My coral, &apos;Aurora&apos;, has grown 2.4cm in just three months! Seeing the data makes it so real.&rdquo;
            </p>
            <p className="font-label-sm text-on-surface-variant mt-4">— Sarah J., Adopter since 2023</p>
          </div>
        </div>
      </div>
    </section>
  );
}
