import React from 'react';

export default function SectionHeading({
  tag,
  titlePrefix,
  highlightWord,
  titleSuffix,
  subtitle,
  align = 'center',
  className = '',
}) {
  const isCenter = align === 'center';

  return (
    <div className={`mb-10 ${isCenter ? 'text-center max-w-2xl mx-auto' : 'max-w-xl'} ${className}`}>
      {tag && (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdea7] text-[#231916] border-2 border-[#231916] shadow-[2px_2px_0px_#231916] text-xs font-black uppercase tracking-wider mb-3 ${isCenter ? 'mx-auto' : ''}`}>
          <span>★</span>
          <span>{tag}</span>
        </div>
      )}

      <h2 className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#231916] tracking-tight leading-[1.05]">
        {titlePrefix}{' '}
        {highlightWord && (
          <span className="text-[#cb4926] underline decoration-[#fdc65c] decoration-wavy underline-offset-8">
            {highlightWord}
          </span>
        )}
        {titleSuffix ? ` ${titleSuffix}` : ''}
      </h2>

      {subtitle && (
        <p className="font-body-md text-sm sm:text-base text-[#59413b] font-medium mt-3 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
