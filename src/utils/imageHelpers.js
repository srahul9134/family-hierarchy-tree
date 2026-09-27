// Helpers for handling image uploads, resizing, and default avatars

export const generateDefaultAvatar = (name = 'Member', gender = 'other') => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'FM';

  const colorMap = {
    male: { bg: 'from-blue-600 to-indigo-700', text: '#93c5fd' },
    female: { bg: 'from-rose-500 to-purple-600', text: '#fbcfe8' },
    other: { bg: 'from-emerald-500 to-teal-700', text: '#a7f3d0' }
  };

  return { initials, color: colorMap[gender] || colorMap.other };
};

export const resizeAndConvertImage = (file, maxWidth = 400, maxHeight = 400) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Invalid image file format'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export as compressed WebP or JPEG Data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const avatarPresets = [
  { id: 'av1', label: 'Elder Gentleman', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { id: 'av2', label: 'Elder Lady', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' },
  { id: 'av3', label: 'Adult Male', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { id: 'av4', label: 'Adult Female', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { id: 'av5', label: 'Young Boy', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80' },
  { id: 'av6', label: 'Young Girl', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
  { id: 'av7', label: 'Professional Male', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80' },
  { id: 'av8', label: 'Professional Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
];
