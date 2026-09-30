import React from 'react';
import logoImg from '../../assets/images/logo.jpg';

interface LogoProps {
  variant?: 'full' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  showTagline = true,
  className = '',
  theme = 'light',
}) => {
  // Dimensions mapping
  const imageSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  if (variant === 'icon') {
    return (
      <div className={`relative shrink-0 overflow-hidden rounded-lg shadow-sm border border-amber-500/30 ${imageSizeClasses} ${className}`}>
        <img
          src={logoImg}
          alt="Agro Baadshah Logo"
          className="w-full h-full object-cover object-top"
        />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-xl border-2 border-amber-500/40 p-0.5 bg-[#0a0f0d]">
          <img
            src={logoImg}
            alt="Agro Baadshah Official Seal"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
    );
  }

  // Full variant (Image + Brand Name Typography + Tagline)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Emblem Image */}
      <div className={`relative shrink-0 overflow-hidden rounded-xl shadow-md border border-amber-500/30 bg-[#06140e] ${imageSizeClasses}`}>
        <img
          src={logoImg}
          alt="Agro Baadshah Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span
            className={`font-serif font-extrabold tracking-tight uppercase leading-none ${
              theme === 'dark' ? 'text-white' : 'text-[#0a3524]'
            } ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base sm:text-lg'}`}
          >
            Agro Baadshah
          </span>
        </div>

        {showTagline && (
          <span
            className={`text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold leading-tight mt-0.5 ${
              theme === 'dark' ? 'text-amber-400' : 'text-emerald-800'
            }`}
          >
            Solutions For A Better Tomorrow
          </span>
        )}
      </div>
    </div>
  );
};
