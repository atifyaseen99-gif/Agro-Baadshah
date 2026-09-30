/**
 * Image processing utilities for Agro Baadshah
 * Handles browser-side file reading, canvas optimization to prevent storage exhaustion,
 * and high-quality domain-specific SVG vector fallbacks for crops, pesticides, and brands.
 */

export const fileToBase64 = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return reject(new Error('Please upload a JPG, JPEG, PNG, or WEBP image.'));
    }

    // Limit initial file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return reject(new Error('Image file is too large. Please select a file under 10MB.'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize proportionally if larger than maximum bounds
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw image with smooth smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp or jpeg for high efficiency
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image file.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
};

/**
 * High-quality Domain Agricultural SVG Generator
 * Used for realistic initial seed data so the store looks stunning out-of-the-box
 * before or alongside admin photo uploads.
 */
export const createAgroPlaceholderSvg = (
  title: string,
  subtitle: string,
  theme: 'cotton' | 'wheat' | 'rice' | 'sugarcane' | 'maize' | 'pesticide' | 'fertilizer' | 'weedicide' | 'fungicide' | 'insecticide' | 'brand' | 'store' | 'citrus' | 'mango'
): string => {
  const themes: Record<string, { bg: string; accent: string; text: string; icon: string }> = {
    cotton: { bg: '#064e3b', accent: '#34d399', text: '#ffffff', icon: '🌱' },
    wheat: { bg: '#78350f', accent: '#fbbf24', text: '#ffffff', icon: '🌾' },
    rice: { bg: '#14532d', accent: '#86efac', text: '#ffffff', icon: '🌿' },
    sugarcane: { bg: '#166534', accent: '#4ade80', text: '#ffffff', icon: '🎍' },
    maize: { bg: '#854d0e', accent: '#fde047', text: '#ffffff', icon: '🌽' },
    citrus: { bg: '#9a3412', accent: '#fb923c', text: '#ffffff', icon: '🍊' },
    mango: { bg: '#a16207', accent: '#facc15', text: '#ffffff', icon: '🥭' },
    insecticide: { bg: '#1e3a5f', accent: '#38bdf8', text: '#ffffff', icon: '🛡️' },
    fungicide: { bg: '#4c1d95', accent: '#c084fc', text: '#ffffff', icon: '🔬' },
    weedicide: { bg: '#831843', accent: '#f472b6', text: '#ffffff', icon: '🌿' },
    pesticide: { bg: '#042f2e', accent: '#2dd4bf', text: '#ffffff', icon: '🧪' },
    fertilizer: { bg: '#134e4a', accent: '#5eead4', text: '#ffffff', icon: '⚗️' },
    brand: { bg: '#1e293b', accent: '#94a3b8', text: '#ffffff', icon: '🏷️' },
    store: { bg: '#064e3b', accent: '#10b981', text: '#ffffff', icon: '👑' },
  };

  const selected = themes[theme] || themes.pesticide;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${selected.bg}" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${selected.accent}" stroke-width="0.75" stroke-opacity="0.15" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" />
    <rect width="100%" height="100%" fill="url(#grid)" />
    <circle cx="400" cy="240" r="110" fill="${selected.accent}" fill-opacity="0.12" stroke="${selected.accent}" stroke-width="1.5" stroke-opacity="0.4" />
    <text x="400" y="270" font-size="76" text-anchor="middle" font-family="system-ui, sans-serif">${selected.icon}</text>
    <text x="400" y="400" font-size="34" font-weight="bold" fill="${selected.text}" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif">${title}</text>
    <text x="400" y="440" font-size="20" fill="${selected.accent}" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" letter-spacing="1">${subtitle}</text>
    <text x="400" y="530" font-size="14" fill="#9ca3af" text-anchor="middle" font-family="system-ui, sans-serif" letter-spacing="2">AGRO BAADSHAH · KHANPUR</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
