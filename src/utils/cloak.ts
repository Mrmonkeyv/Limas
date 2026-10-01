export type CloakType = 'default' | 'docs' | 'classroom' | 'drive' | 'canvas';

interface CloakConfig {
  title: string;
  favicon: string;
}

export const CLOAK_PRESETS: Record<CloakType, CloakConfig> = {
  default: {
    title: 'ArcadeVault - Unblocked Games Portal',
    favicon: '/favicon.ico',
  },
  docs: {
    title: 'Untitled document - Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
  },
  classroom: {
    title: 'Home - Google Classroom',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png',
  },
  drive: {
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
  },
  canvas: {
    title: 'Dashboard - Canvas LMS',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
  },
};

export function applyCloak(type: CloakType) {
  const config = CLOAK_PRESETS[type] || CLOAK_PRESETS.default;
  document.title = config.title;

  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = config.favicon;
  localStorage.setItem('arcade_cloak', type);
}

export function openInAboutBlank(url: string, title = 'Google Docs') {
  try {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Popup was blocked by your browser. Please allow popups for about:blank stealth mode.');
      return;
    }
    win.document.title = title;
    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    win.document.body.style.overflow = 'hidden';
    win.document.body.style.backgroundColor = '#000000';

    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.margin = '0';
    iframe.src = window.location.origin + url;
    iframe.allow = 'autoplay; fullscreen; keyboard';
    win.document.body.appendChild(iframe);
  } catch (e) {
    console.error('About blank launch failed:', e);
  }
}
