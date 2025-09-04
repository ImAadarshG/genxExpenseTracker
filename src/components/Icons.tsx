// Component to generate PWA icons
export function generatePWAIcons() {
  if (typeof window === 'undefined') return;
  
  const sizes = [192, 512];
  
  sizes.forEach(size => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      
      // Add rounded corners
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, size * 0.15);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      
      // Draw icon
      ctx.fillStyle = 'white';
      ctx.font = `bold ${size * 0.4}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('₹', size / 2, size / 2 - size * 0.05);
      
      // Add text
      ctx.font = `bold ${size * 0.08}px system-ui, -apple-system, sans-serif`;
      ctx.fillText('TRACKER', size / 2, size / 2 + size * 0.25);
      
      // Convert to blob and create object URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          // This URL can be used as icon source
          console.log(`Generated ${size}x${size} icon:`, url);
        }
      });
    }
  });
}
