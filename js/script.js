// =============================
// GOOGLE ANALYTICS
// =============================
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-X2R58E5647');



// =============================
//BREADCUMBS
// =============================
function initBreadcrumbs() {
  const bc = document.getElementById('breadcrumb');
  if (!bc) return;

  const path = window.location.pathname;

  let trail = [{ label: 'Home', url: 'index.html' }];

  if (path.includes('projects.html')) {
    trail.push({ label: 'All Projects', url: 'projects.html' });
  }

  if (path.includes('p_descript.html')) {
    trail.push({ label: 'All Projects', url: 'projects.html' });
    trail.push({ label: 'Project Details', url: '#' });
  }

  if (path.includes('d_notes.html')) {
    trail.push({ label: 'Designer Notes', url: 'd_notes.html' });
  }

  if (path.includes('resume.html')) {
    trail.push({ label: 'Resume', url: 'resume.html' });
  }

  bc.innerHTML = trail
    .map((item, i) => {
      if (i === trail.length - 1) {
        return `<span>${item.label}</span>`;
      }
      return `<a href="${item.url}">${item.label}</a>`;
    })
    .join(' <i class="fa-solid fa-angle-right mx-2"></i> ');
}

// =============================
// LOGO INDEX
// =============================

// This feature explores how color affects perception and user experience.
// It was intentionally removed from the final version to keep the interface
// focused and consistent, but kept here for reference.

/* function initLogoTheme() {
  const themeActive = sessionStorage.getItem('theme') === 'brand';
  document.body.classList.toggle('brand-mode', themeActive);

  const logo = document.getElementById('logo_container');
  if (!logo) return;

  let active = themeActive;

  logo.addEventListener('click', () => {
    active = !active;

    document.body.classList.toggle('brand-mode', active);

    if (active) {
      sessionStorage.setItem('theme', 'brand');
    } else {
      sessionStorage.removeItem('theme');
    }
  });
}

if (performance.navigation.type === 1) {
  sessionStorage.removeItem('theme');
}

//mosaic
function initMosaicLogo() {
  const logo = document.querySelector('.logo-mosaic');
  if (!logo || logo.dataset.mosaicLogoInit === 'true') return;

  logo.dataset.mosaicLogoInit = 'true';

  const lineCount = 120;

  function burstLines() {
    for (let i = 0; i < lineCount; i += 1) {
      const line = document.createElement('span');
      line.classList.add('line');

      const isTop = Math.random() > 0.5;
      line.classList.add(isTop ? 'top' : 'bottom');

      line.style.left = `${Math.random() * 100}%`;
      line.style.background = 'var(--background-soft)';

      logo.appendChild(line);

      setTimeout(() => {
        if (isTop) {
          line.style.top = '-120%';
        } else {
          line.style.bottom = '-120%';
        }

        line.style.opacity = '0';
      }, Math.random() * 80);

      setTimeout(() => {
        line.remove();
      }, 380);
    }
  }

  logo.addEventListener('mouseenter', burstLines);
  logo.addEventListener('mouseleave', burstLines);
}
 */
// =============================
// GLOBAL HELPERS
// =============================
const isIndexPage = () => {
  const path = window.location.pathname;
  return path === '/' || path.endsWith('/index.html') || path.endsWith('index.html');
};

const getProjectUrl = (projectId) => `p_descript.html?id=${encodeURIComponent(projectId)}`;

function handleSectionRedirect() {
  if (!isIndexPage()) return;

  const params = new URLSearchParams(window.location.search);
  const sectionId = params.get('section');
  if (!sectionId) return;

  const section = document.getElementById(sectionId);
  if (!section) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  
      history.replaceState(null, '', 'index.html');
    }, 200);
  });
}

function updateReusableMenuLinks() {
  const onIndex = isIndexPage();

  const links = document.querySelectorAll(
    'a[href*="section=projects"], a[href*="section=skills"], a[href*="section=contact"], a[href="#projects"], a[href="#skills"], a[href="#contact"], a[href="index.html#projects"], a[href="index.html#skills"], a[href="index.html#contact"]'
  );

  links.forEach((link) => {
    const href = link.getAttribute('href');

    let sectionId = '';

    if (href.includes('projects')) sectionId = 'projects';
    if (href.includes('skills')) sectionId = 'skills';
    if (href.includes('contact')) sectionId = 'contact';

    if (!sectionId) return;

    if (onIndex) {
      link.setAttribute('href', `#${sectionId}`);

      link.addEventListener('click', (e) => {
        e.preventDefault();

        const section = document.getElementById(sectionId);
        if (!section) return;

        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        history.replaceState(null, '', `#${sectionId}`);

        const menu = document.getElementById('navMenu');
        if (menu) menu.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    } else {
      link.setAttribute('href', `index.html?section=${sectionId}`);
    }
  });
}


async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

function truncateText(text = '', limit = 110) {
  return text.length > limit ? `${text.slice(0, limit).trim()}…` : text;
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =============================
// TYPEWRITER
// =============================
function createTypeWriter(elementId, texts) {
  const element = document.getElementById(elementId);
  if (!element || !Array.isArray(texts) || texts.length === 0) return;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const speed = 100;
  const deleteSpeed = 60;
  const pause = 1200;

  function typeWriter() {
    const currentText = texts[textIndex];

    if (!isDeleting) {
      if (charIndex < currentText.length) {
        element.textContent += currentText.charAt(charIndex);
        charIndex += 1;
        setTimeout(typeWriter, speed);
      } else {
        setTimeout(() => {
          isDeleting = true;
          typeWriter();
        }, pause);
      }
    } else if (charIndex > 0) {
      charIndex -= 1;
      element.textContent = currentText.substring(0, charIndex);
      setTimeout(typeWriter, deleteSpeed);
    } else {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(typeWriter, 300);
    }
  }

  typeWriter();
}

// =============================
// MOSAIC BUTTONS
// =============================
function getLineColorFromBackground(btn) {
  let el = btn.parentElement;

  while (el) {
    const bg = window.getComputedStyle(el).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      return 'var(--background-color)';
    }
    el = el.parentElement;
  }

  return 'var(--background-color)';
}
function initMosaicButtons(scope = document) {
  const buttons = scope.querySelectorAll('.mosaic_btn');
  const lineCount = 50;

  buttons.forEach((btn) => {
    if (btn.dataset.mosaicInit === 'true') return;
    btn.dataset.mosaicInit = 'true';

    const originalColor = getComputedStyle(btn).color;
    const originalLetterSpacing = getComputedStyle(btn).letterSpacing;

    const burstLines = () => {
      for (let i = 0; i < lineCount; i += 1) {
        const line = document.createElement('span');
        line.classList.add('line');
        line.style.background = getLineColorFromBackground(btn);

        const isTop = Math.random() > 0.5;
        line.classList.add(isTop ? 'top' : 'bottom');
        line.style.left = `${Math.random() * 100}%`;

        btn.appendChild(line);

        setTimeout(() => {
          if (isTop) line.style.top = '-100%';
          else line.style.bottom = '-100%';
        }, Math.random() * 200);

        setTimeout(() => line.remove(), 80);
      }
    };

    btn.addEventListener('mouseenter', () => {
      btn.style.letterSpacing = '0.05em';
      burstLines();
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.removeProperty('color');
      btn.style.letterSpacing = originalLetterSpacing;
      burstLines();
    });
  });
}

// =============================
// MENU sticky en index
// =============================
function initProjectSectionHeader() {
  if (!isIndexPage()) return;

  const header = document.getElementById('header-container');
  const section = document.getElementById('projects');

  if (!header || !section) return;

  function update() {
    const isDesktop = window.innerWidth > 768;

    if (!isDesktop) {
      header.classList.remove('show-project-header');
      return;
    }

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    // aparece cuando la parte superior de projects llega al 70% de la pantalla
    const showHeader = rect.top <= vh * 0.15;

    if (showHeader) {
      header.classList.add('show-project-header');
    } else {
      header.classList.remove('show-project-header');
    }
  }

  window.addEventListener('scroll', update);
  window.addEventListener('resize', update);

  update();
}

// =============================
// MENU INJECTION
// =============================
function initMobileMenu() {
  const btn = document.getElementById('btn_menu');
  const menu = document.getElementById('navMenu');
  if (!btn || !menu) return;

  if (btn.dataset.init === 'true') return;
  btn.dataset.init = 'true';

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
}

async function injectSharedLayout() {
  try {
    const [headerHtml, footerHtml, mobileMenuHtml] = await Promise.all([
      fetch('./data/header.html').then((res) => res.text()),
      fetch('./data/footer.html').then((res) => res.text()),
      fetch('./data/h_menu.html').then((res) => res.text())
    ]);

    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
      headerContainer.innerHTML = headerHtml;
    }

    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      footerContainer.innerHTML = footerHtml;
      initMosaicButtons(footerContainer);
    }

    const hMenuContainer = document.getElementById('h_menu-container');
    if (hMenuContainer) {
      hMenuContainer.innerHTML = mobileMenuHtml;
      initMobileMenu();
    }

    updateReusableMenuLinks();
  } catch (error) {
    console.error('Shared layout injection error:', error);
  }
}



// =============================
// PROJECT RENDERING
// =============================
function createFeaturedProjectCard(project, isMobile) {
  const imageSrc = getResponsiveImage(project.images);

  return `
    <article class="project-card" data-id="${escapeHtml(project.id)}">
      <a class="project-thumb" href="${getProjectUrl(project.id)}" aria-label="View ${escapeHtml(project.title)} project details">
        <img src="${escapeHtml(imageSrc)}"data-aos="zoom-in" alt="${escapeHtml(project.title)} preview image">
        <div class="project-overlay"><span>View Project</span></div>
      </a>

      <div class="project-meta">
        <span class="project-kicker">${escapeHtml(project.category || '')}</span>
        <h4 class="project-title">${escapeHtml(project.title)}</h4>
        <p class="project-stack">${escapeHtml(project.cardStack || project.subtitle || '')}</p>
      </div>
    </article>`;
}

function renderFeaturedProjects(data) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const featuredProjects = data.projects.filter((project) => project.featured !== false).slice(0, 4);
  const isMobile = window.matchMedia('(max-width: 863px)').matches;

  grid.innerHTML = featuredProjects
    .map((project) => createFeaturedProjectCard(project, isMobile))
    .join('');
}

function createArchiveProjectCard(project) {
  return `
    <article class="archive-card" data-id="${escapeHtml(project.id)}">
      <div class="archive-thumb">
       <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(project.title)} preview image" loading="lazy" decoding="async">
      </div>

      <div class="archive-copy">
        <span class="archive-subtitle">${escapeHtml(project.subtitle || project.category || '')}</span>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.summary || project.description || '')}</p>

        <div class="archive-links">
        <div class="icon-circle">
       <i class="fa-solid fa-arrow-right-long"></i>
        </div>
        </div>
      </div>
    </article>`;
}

function initArchiveCardClicks() {
  const cards = document.querySelectorAll('.archive-card');

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.archive-links a')) return;

      const projectId = card.dataset.id;
      if (!projectId) return;

      window.location.href = getProjectUrl(projectId);
    });
  });
}

function renderProjectsArchive(data) {
  const listing = document.getElementById('projects-listing');
  const heroContainer = document.querySelector('.projects-hero');
  if (!listing) return;

  const orderedProjects = [
    ...data.projects.filter(p => p.featured === true),
    ...data.projects.filter(p => p.featured === false)
  ];

  //Aqui es q empieza la p_decript


  const hero = orderedProjects[0];

  if (heroContainer && hero) {
    heroContainer.innerHTML = `
      <a href="${getProjectUrl(hero.id)}">
      <div class="project-hero-card archive-card">
        <img src="${getResponsiveImage(hero.images)}" alt="${hero.title}">
        <div class="project-hero-content">
          <span class="archive-subtitle">${hero.category}</span>
          <h3>${hero.title}</h3>
          <p>${hero.summary || ''}</p>    
             <div class="archive-links d-flex justify-content-end">
        <div class="icon-circle">
       <i class="fa-solid fa-arrow-right-long"></i>
        </div>
        </div>      
        </div>     
      </div>
    
      
      </a>
      
    `;
  }

  const rest = orderedProjects.slice(1);

  listing.innerHTML = rest
    .map(createArchiveProjectCard)
    .join('');

  initArchiveCardClicks();
}

function createProjectCaseGrid(project) {
  const sections = [
    { title: 'Overview', data: project.description },
    { title: 'Challenge', data: project.challenge },
    { title: 'Solution', data: project.solution },
    { title: 'Impact', data: project.impact }
  ];

  return `
    <div class="project-case-grid">
      ${sections.map((section, index) => {
        const text = section.data?.text || '';
        const images = Array.isArray(section.data?.images) ? section.data.images : [];

        return `
          <section class="project-case-row ">
           <div class="project-case-text">
            <div>
             <h5>${escapeHtml(section.title)}</h5>
              <p>${escapeHtml(text)}</p>
               </div>
               </div>

            <div class="project-case-images">
              ${images.map((img, imgIndex) => `
                <a href="${escapeHtml(img)}" data-fancybox="gallery" >
                  <img src="${escapeHtml(img)}"data-aos="zoom-in" alt="${escapeHtml(section.title)} image ${imgIndex + 1} loading="lazy"  decoding="async">
                </a>
              `).join('')}
            </div>
          </section>
        `;
      }).join('')}
    </div>
  `;
}


function createMetaBlock(title, value) {
  if (!value || (Array.isArray(value) && value.length === 0)) return '';

  const content = Array.isArray(value)
    ? value.map((item) => `<p>${escapeHtml(item)}</p>`).join('')
    : `<p>${escapeHtml(value)}</p>`;

  return `
    <div class="meta-block">
      <h5>${escapeHtml(title)}</h5>
      ${content}
    </div>`;
}
function renderProjectDetail(project) {
  const projectContainer = document.getElementById('projects-list');
  if (!projectContainer) return;

  projectContainer.innerHTML = `
    <section class="project-detail-shell">
       
      <div class="project-detail-head secondary-hero" data-aos="fade-up">
        <div class="project-head-copy"> 
          <h1>${escapeHtml(project.title || '')}</h1>
          ${project.subtitle ? `<h4>${escapeHtml(project.subtitle)}</h4>` : ''}
          <p class="project-summary">${escapeHtml(project.summary || '')}</p>
        </div>

        <div class="project-head-meta">
          ${createMetaBlock('Role', project.roles)}
          ${createMetaBlock('Key Features', project.features)}
        </div>
      </div>
    <div class="project-links">
            ${project.live ? `<a href="${escapeHtml(project.live)}" target="_blank" rel="noreferrer" class="btn m_text ">Live Site</a>` : ''}
            ${project.github ? `<a href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer" class="btn m_text">GitHub</a>` : ''}
        </div>
      <section class="project-layout" data-aos="fade-up">

        ${createProjectCaseGrid(project)}

        <div class="project-final-block">
          ${project.technologies?.length ? `
            <div class="meta-block">
              <h5>Technologies</h5>
              <p class="tech-inline">${project.technologies.map(escapeHtml).join(' • ')}</p>
            </div>` : ''}

          <div class="project-links">
            ${project.live ? `<a href="${escapeHtml(project.live)}" target="_blank" rel="noreferrer" class="btn m_text ">Live Site</a>` : ''}
            ${project.github ? `<a href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer" class="btn m_text">GitHub</a>` : ''}
          </div>
        </div>
      </section>
    </section>`;

  initMosaicButtons(projectContainer);

  if (window.Fancybox) {
    Fancybox.bind("[data-fancybox='gallery']", {
      infinite: false,
      Toolbar: true,
      closeButton: 'top'
    });
  }
}



function getResponsiveImage(images) {
  if (!Array.isArray(images)) return 'images/placeholder.png';

  const isMobile = window.matchMedia('(max-width: 863px)').matches;

  const desktopImg = images.find(img => img.includes('_0d'));
  const mobileImg = images.find(img => img.includes('_0m'));

  if (isMobile) {
    return mobileImg || desktopImg || images[0];
  } else {
    return desktopImg || images[0];
  }
}

async function initProjects(data) {
  renderFeaturedProjects(data);
  renderProjectsArchive(data);

  const featuredGrid = document.getElementById('projects-grid');
  if (featuredGrid) {
    window.addEventListener('resize', () => {
      renderFeaturedProjects(data);
      renderProjectsArchive(data);
    });
  }

  const detailContainer = document.getElementById('projects-list');
  if (detailContainer) {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (!projectId) {
      detailContainer.innerHTML = '<p>No project was selected.</p>';
      return;
    }

    const project = data.projects.find((item) => item.id === projectId);
    if (!project) {
      detailContainer.innerHTML = '<p>Project not found.</p>';
      return;
    }

    renderProjectDetail(project);
  }
}
// =============================
// DESIGNER NOTES
// =============================
function initDesignerNotes(data) {
  const tDnote = document.getElementById('t_dnote');
  const dnoDescrip = document.getElementById('dno_descrip');
  const pdnLink = document.getElementById('pdn_link');
  const secDiag = document.getElementById('sec_diag');

  const notesTech = document.getElementById('notes_tech');
  const notesDirection = document.getElementById('notes_direction');
  const notesTypography = document.getElementById('notes_typography');
  const notesColors = document.getElementById('notes_colors');
  const notesIntent = document.getElementById('notes_intent');
  const notesDecisions = document.getElementById('notes_decisions');


  if (!tDnote || !dnoDescrip || !pdnLink || !secDiag) return;

  const project = data.d_notes?.[0];
  if (!project) return;

  tDnote.textContent = project.title;
  dnoDescrip.textContent = project.description;

  // Technologies
  if (notesTech && project.technologies?.length) {
    notesTech.textContent = project.technologies.join(' • ');
  }

  // Design direction
  if (notesDirection && project.design?.direction?.length) {
    notesDirection.innerHTML = project.design.direction
      .map((item) => `<p>${escapeHtml(item)}</p>`)
      .join('');
  }

  // Typography
  if (notesTypography && project.design?.typography?.length) {
    notesTypography.innerHTML = project.design.typography
      .map((font) => `<p>${escapeHtml(font)}</p>`)
      .join('');
  }

  // Colors
  if (notesColors && project.design?.colors?.length) {
    notesColors.innerHTML = project.design.colors
      .map((color) => `
        <div class="color-row">
          <span 
            class="color-swatch" 
            style="background:${escapeHtml(color.value)}">
          </span>
          <div>
            <p>${escapeHtml(color.name)}</p>
            <small>${escapeHtml(color.value)}</small>
          </div>
        </div>
      `)
      .join('');
  }

  // Intent
  if (notesIntent && project.process?.intent) {
    notesIntent.textContent = project.process.intent;
  }

  // Decisions
  if (notesDecisions && project.process?.decisions?.length) {
    notesDecisions.innerHTML = project.process.decisions
      .map((decision) => `<li>${escapeHtml(decision)}</li>`)
      .join('');
  }

  // Links
  pdnLink.innerHTML = `
    <div class="project-links mt-0  text-start">
      ${project.github ? `<a href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer" class="btn m_text">GitHub</a>` : ''}
     
      </div>`;

// Gallery
const diagramItems = project.gallery.filter((item) =>
  item.type === 'diagram' || item.type === 'diagram-zone'
);

const sketchItems = project.gallery.filter((item) =>
  item.type !== 'diagram' && item.type !== 'diagram-zone'
);

secDiag.innerHTML = `
  <div class="diagram-column py-5">
    ${diagramItems.map((item) => `
      <article class="diag-card diag-card-featured">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>

        ${item.image.endsWith('.svg') ? `
          <div class="diagram-svg" data-src="${escapeHtml(item.image)}"></div>
        ` : `
          <a href="${escapeHtml(item.image)}" data-fancybox="notes">
            <img 
              src="${escapeHtml(item.image)}"
              data-aos="zoom-in"
              alt="${escapeHtml(item.title)}"
              class="diag-img img-thum"
              loading="lazy"
              decoding="async">
          </a>
        `}
      </article>
    `).join('')}
  </div>

  <div class="sketch-stack py-5">
    ${sketchItems.map((item) => `
      <article class="diag-card sketch-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <a href="${escapeHtml(item.image)}" data-fancybox="notes">
          <img src="${escapeHtml(item.image)}" data-aos="zoom-in" alt="${escapeHtml(item.title)}" class="diag-img">
        </a>
      </article>
    `).join('')}
  </div>
`;

// Load SVG inline
// Load SVG inline
secDiag.querySelectorAll('.diagram-svg').forEach(async (el) => {
  const url = el.dataset.src;

  try {
    const res = await fetch(url);
    const svgText = await res.text();
    el.innerHTML = svgText;
  } catch (error) {
    console.error('Error loading SVG:', error);
  }
});

// Fancybox
if (window.Fancybox) {
  Fancybox.bind("[data-fancybox='notes']", {
    infinite: false,
    Toolbar: true,
    closeButton: "top"
  });
}

initMosaicButtons(pdnLink);
}

/* =============================
   RESUME
============================= */
function initResume(data) {
  const aboutme = data.about?.[0];
  const titlesCol = document.getElementById('titles_col');
  const personalDiv = document.getElementById('p_info');
  const descContent = document.getElementById('desc_content');

  if (!aboutme || !titlesCol || !personalDiv || !descContent) return;

  personalDiv.innerHTML = `
    <div class="resume-contact-inner">
      <h2 class="resume-name">${escapeHtml(aboutme.personal.name)}</h2>
      <div class="resume-contact-lines">
        <p>${escapeHtml(aboutme.personal.phone)}</p>
        <p>${escapeHtml(aboutme.personal.email)}</p>
        <a href="${escapeHtml(aboutme.personal.website)}" class="resume-website" target="_blank" rel="noreferrer">
          ${escapeHtml(aboutme.personal.website.replace(/^https?:\/\//, ''))}
        </a>
      </div>
    </div>
  `;

  const topics = Object.keys(aboutme).filter(
    (key) => key !== 'pageTitle' && key !== 'personal'
  );

  let selectedTopic = topics[0];

  function formatTopicLabel(topic) {
    return topic
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function renderTitles() {
    titlesCol.innerHTML = '';

    topics.forEach((topic) => {
      const div = document.createElement('button');
      div.type = 'button';
      div.className = `title_item${topic === selectedTopic ? ' selected' : ''}`;
      div.innerHTML = `
        <span class="title_dot"></span>
        <span class="title_label">${escapeHtml(formatTopicLabel(topic))}</span>
      `;

      div.addEventListener('click', () => {
        selectedTopic = topic;
        renderTitles();
        renderDesc();
      });

      titlesCol.appendChild(div);
    });
  }

  function renderDesc() {
    descContent.innerHTML = '';
    const sectionData = aboutme[selectedTopic];
    if (!sectionData) return;

    if (Array.isArray(sectionData) && typeof sectionData[0] === 'string') {
      const block = document.createElement('div');
      block.className = 'resume-block';

      const ul = document.createElement('ul');
      ul.className = 'resume-list';

      sectionData.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });

      block.appendChild(ul);
      descContent.appendChild(block);
      return;
    }

    if (selectedTopic === 'education') {
      sectionData.forEach((item) => {
        const div = document.createElement('article');
        div.className = 'resume-entry';

        div.innerHTML = `
          <h3>${escapeHtml(item.institution)}</h3>
          <p class="resume-subtitle">${escapeHtml(item.degree).replace(/\n/g, '<br>')}</p>
          <p class="resume-date">${escapeHtml(item.graduation)}</p>
        `;

        descContent.appendChild(div);
      });
      return;
    }

    if (selectedTopic === 'experience') {
      sectionData.forEach((job) => {
        const article = document.createElement('article');
        article.className = 'resume-entry';

        const ul = document.createElement('ul');
        ul.className = 'resume-list';

        job.responsibilities.forEach((responsibility) => {
          const li = document.createElement('li');
          li.textContent = responsibility;
          ul.appendChild(li);
        });

        article.innerHTML = `
          <h3>${escapeHtml(job.title)}</h3>
          <p class="resume-subtitle">${escapeHtml(job.organization)} — ${escapeHtml(job.location)}</p>
          <p class="resume-date">${escapeHtml(job.period)}</p>
        `;

        article.appendChild(ul);
        descContent.appendChild(article);
      });
      return;
    }

    if (Array.isArray(sectionData)) {
      sectionData.forEach((item) => {
        const article = document.createElement('article');
        article.className = 'resume-entry';
        article.innerHTML = `<p>${escapeHtml(String(item))}</p>`;
        descContent.appendChild(article);
      });
    }
  }

  renderTitles();
  renderDesc();
}

// =============================
// SKILLS
// =============================
function initAboutMe(data) {
  const aboutData = data.about_me?.[0];
  const sidebar = document.getElementById('sidebar');
  const displayBox = document.getElementById('display-box');

  if (!aboutData || !sidebar || !displayBox) return;

  let firstLoaded = false;

  const showProject = (item, itemDiv) => {
    const imgSrc = Array.isArray(item.image) ? item.image[0] : item.image;

    displayBox.innerHTML = `
      <img src="${escapeHtml(imgSrc)}"data-aos="zoom-in" alt="${escapeHtml(item.title)}">
      <div class="description">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </div>`;

    document.querySelectorAll('.item').forEach((el) => el.classList.remove('active'));
    if (itemDiv) itemDiv.classList.add('active');
  };

  Object.keys(aboutData).forEach((category) => {
    const catDiv = document.createElement('div');
    catDiv.classList.add('category');

    const header = document.createElement('div');
    header.classList.add('cat-header');
    header.innerHTML = `
      <span>${escapeHtml(category)}</span>
      <span class="plus">+</span>`;

    const itemsDiv = document.createElement('div');
    itemsDiv.classList.add('items');

    aboutData[category].forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');
      itemDiv.textContent = item.title;

      itemDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        showProject(item, itemDiv);
      });

      if (!firstLoaded && index === 0) {
        showProject(item, itemDiv);
        catDiv.classList.add('open');
        firstLoaded = true;
      }

      itemsDiv.appendChild(itemDiv);
    });

    header.addEventListener('click', () => {
      document.querySelectorAll('.category').forEach((cat) => {
        if (cat !== catDiv) cat.classList.remove('open');
      });
      catDiv.classList.toggle('open');
    });

    catDiv.appendChild(header);
    catDiv.appendChild(itemsDiv);
    sidebar.appendChild(catDiv);
  });
}


function initSkills(data) {
  const skills = document.querySelectorAll('.skill');
  if (!skills.length) return;

  skills.forEach((skillEl) => {
    const key = skillEl.dataset.title?.toLowerCase();
    const skillData = data.skills.find((item) => item.id.toLowerCase() === key);
    if (!skillData) return;

    const overlay = skillEl.querySelector('.skill-overlay');
    const inner = skillEl.querySelector('.skill-inner');
    if (!overlay || !inner) return;

    overlay.innerHTML = `<span>${escapeHtml(skillData.overlay)}</span>`;
    inner.innerHTML = `
      <h3>${escapeHtml(skillData.title)}</h3>
      <ul>${skillData.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul>
      <small>${skillData.tools.map(escapeHtml).join(' • ')}</small>`;

    skillEl.addEventListener('click', () => {
      skills.forEach((skill) => {
        if (skill !== skillEl) skill.classList.remove('active');
      });
      skillEl.classList.toggle('active');
    });
  });
}

// =============================
// CONTACT POPUP
// =============================
function initContactForm() {
  const popup = document.getElementById('pop_up');
  const form = document.getElementById('contactForm');
  if (!popup || !form) return;

  function openPopup() {
    popup.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
  }

  function closePopup() {
    popup.classList.remove('active');
    popup.setAttribute('aria-hidden', 'true');
  }

  window.closePopup = closePopup;

  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      await fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
      });

      openPopup();
      form.reset();
    } catch (error) {
      console.error('Contact form error:', error);
    }
  });
}

// =============================
// MOBILE FLOAT BUTTON
// =============================
function initMobileScrollButton() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileBtnLink = document.querySelector('#mobile-menu-btn a');
  const introSection = document.getElementById('intro');
  const fadeOverlay = document.getElementById('fade-overlay');

  if (mobileMenuBtn) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current <= 20) {
        mobileMenuBtn.style.opacity = '0';
      } else if (current > lastScroll) {
        mobileMenuBtn.style.opacity = '1';
      }
      lastScroll = current;
    });
  }

  if (!mobileBtnLink || !introSection) return;

  mobileBtnLink.addEventListener('click', (e) => {
    e.preventDefault();

    if (fadeOverlay) {
      fadeOverlay.classList.add('show');
    }

    setTimeout(() => {
      introSection.scrollIntoView({ behavior: 'smooth' });
      if (fadeOverlay) fadeOverlay.classList.remove('show');
    }, 350);
  });
}

// =============================
// APP INIT
// =============================
async function initApp() {
  await injectSharedLayout();

 /*  initLogoTheme();
  initMosaicLogo(); */

  initBreadcrumbs();
  initProjectSectionHeader();
  handleSectionRedirect();
  initMosaicButtons();
  initContactForm();
  initMobileScrollButton();
 
 

  createTypeWriter('typewriter', [
    'Let’s connect!',
    'Let’s Build Something Great!'
  ]);

  createTypeWriter('typewriter_hero', [
    'Hi, I’m Gretel,',
    'Welcome to my portfolio.',
    'Let’s bring your vision to life.'
  ]);

  try {
    const data = await fetchJSON('./data/projects.json');
    await initProjects(data);
    initDesignerNotes(data);
    initResume(data);
    initAboutMe(data);
    initSkills(data);
  } catch (error) {
    console.error('App initialization data error:', error);
  }
}

document.addEventListener('DOMContentLoaded', initApp);


