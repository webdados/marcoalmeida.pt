// Theme selection and dynamic loading
(async function() {
  const availableThemes = ['bulky', 'kubrik', 'bright', 'dark', 'minimal'];
  const params = new URLSearchParams(window.location.search);
  let theme = params.get('theme');
  
  // If no theme in URL, try to get it from config.json
  if (!theme) {
    try {
      const response = await fetch('config.json');
      const config = await response.json();
      theme = config.theme;
    } catch (error) {
      console.error('Error loading config.json:', error);
    }
  }
  
  // Normalize and validate
  if (!theme || !availableThemes.includes(theme)) {
    theme = 'minimal'; // Fallback to minimal if config.json fails or theme is invalid
  }
  
  const cacheBust = '?v=' + Math.random();
  // Remove any existing theme link
  const oldTheme = document.getElementById('theme-css');
  if (oldTheme) oldTheme.remove();
  // Create and append the new theme link
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `styles/${theme}.css${cacheBust}`;
  link.id = 'theme-css';
  document.head.appendChild(link);
})();

// Cachebusting for CSS assets
function addRandomCacheBuster(linkId) {
    const link = document.getElementById(linkId);
    if (!link) return;
    const path = link.getAttribute('href').split('?')[0];
    link.href = `${path}?v=${Math.random()}`;
}
addRandomCacheBuster('core-stylesheet');

// Load and apply configuration
async function initializeContent() {
  try {
    const response = await fetch('config.json');
    const config = await response.json();

    // Set page title
    document.title = config.profile.name;

    // Set meta description dynamically
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', config.profile.tagline || config.profile.bio || '');
    }

    // Set profile information
    document.getElementById('profile-name').textContent = config.profile.name;
    document.getElementById('profile-tagline').textContent = config.profile.tagline;
    document.getElementById('bio-text').textContent = config.profile.bio;

    // Set Gravatar image using SHA-256 (CryptoJS must be loaded in the page)
    const gravatarHash = CryptoJS.SHA256(config.profile.gravatarEmail.trim().toLowerCase());
    const profileImage = document.getElementById('profile-image');
    profileImage.src = `https://www.gravatar.com/avatar/${gravatarHash}?s=200&d=mp`;
    profileImage.alt = `Profile picture of ${config.profile.name}`;

    // Generate social icons
    const socialIcons = document.querySelector('.social-icons');
    const socialIconMap = {
      x: `<svg class="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      linkedin: `<svg class="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
      email: `<svg class="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/></svg>`,
      wordpress: `<svg class="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.109m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.607-3.582.607M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.212 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0"/></svg>`,
      github: `<svg class="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
      bluesky: `<svg class="social-icon" viewBox="0 0 64 57" fill="currentColor" aria-hidden="true" focusable="false"><path d="M13.873 3.805C21.21 9.332 29.103 20.537 32 26.55v15.882c0-.338-.13.044-.41.867-1.512 4.456-7.418 21.847-20.923 7.944-7.111-7.32-3.819-14.64 9.125-16.85-7.405 1.264-15.73-.825-18.014-9.015C1.12 23.022 0 8.51 0 6.55 0-3.268 8.579-.182 13.873 3.805ZM50.127 3.805C42.79 9.332 34.897 20.537 32 26.55v15.882c0-.338.13.044.41.867 1.512 4.456 7.418 21.847 20.923 7.944 7.111-7.32 3.819-14.64-9.125-16.85 7.405 1.264 15.73-.825 18.014-9.015C62.88 23.022 64 8.51 64 6.55c0-9.818-8.578-6.732-13.873-2.745Z"/></svg>`
    };

    Object.entries(config.social).forEach(([platform, url]) => {
      if (url) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.ariaLabel = `Visit ${platform} profile`;
        a.innerHTML = socialIconMap[platform];
        socialIcons.appendChild(a);
      }
    });

    // Generate link buttons, but skip the Contact Me link if it matches config.contact.url
    const linksGrid = document.querySelector('.links-grid');
    config.links.forEach(link => {
      // Skip if this link is the contact link
      if (config.contact && link.url === config.contact.url) return;
      const a = document.createElement('a');
      a.href = link.url;
      a.className = 'link-button';
      a.textContent = link.title;
      a.ariaLabel = `Visit ${link.title}`;
      linksGrid.appendChild(a);
    });

    // Set support button
    const supportBtn = document.getElementById('support-button');
    supportBtn.href = config.support.url;
    supportBtn.textContent = config.support.buttonText;
    supportBtn.ariaLabel = config.support.buttonText;

    // Set contact button (footer) using config.contact only
    const contactBtn = document.getElementById('contact-button');
    if (config.contact && config.contact.url && config.contact.buttonText) {
      contactBtn.href = config.contact.url;
      contactBtn.textContent = config.contact.buttonText;
      contactBtn.ariaLabel = config.contact.buttonText;
      contactBtn.style.display = '';
    } else {
      contactBtn.style.display = 'none';
    }

    // Load blog post
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(config.blog.rssFeed)}`)
      .then(response => response.json())
      .then(data => {
        const post = data.items[0];
        document.querySelector('.post-content').innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.description.split(' ').slice(0, config.blog.wordCount).join(' ')}...</p>
          <a href="${post.link}" class="read-more" aria-label="Read more about ${post.title}">Read More →</a>
        `;
      })
      .catch(error => {
        console.error('Error fetching blog post:', error);
        document.querySelector('.post-content').innerHTML = `
          <p>Visit my blog at <a href="${config.blog.rssFeed.split('/feed')[0]}" aria-label="Visit Marco Almeida's blog">blog.wonderm00n.com</a></p>
        `;
      });

  } catch (error) {
    console.error('Error loading configuration:', error);
  }
}

// Initialize the page
initializeContent();