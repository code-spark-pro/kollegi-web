// Public VK ID application settings. Never put a VK client secret in this file.
window.KOLLEGI_VK = {
  clientId: '',
  redirectUri: `${window.location.origin}${window.location.pathname.replace(/index\.html$/, '')}vk-callback.html`
};
