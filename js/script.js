/* =====================================================================
   GRETEL ALVAREZ TANG — PORTFOLIO SCRIPT
   =====================================================================
   1.  Global helpers
   2.  Shared layout (header, footer, mobile menu)
   3.  Navigation (breadcrumbs, section links, sticky header)
   4.  Interactions (typewriter, mosaic buttons, mobile float button)
   5.  Projects — home: case studies section
   6.  Projects — archive page (projects.html)
   7.  Projects — detail page (p_descript.html)
   8.  Projects — init
   9.  Designer notes
   10. Resume
   11. About me
   12. Testimonials
   13. Contact form popup
   14. App init
   ===================================================================== */


/* =============================
   1. GLOBAL HELPERS
============================= */

const isIndexPage = () => {
  const path = window.location.pathname;
  return path === '/' || path.endsWith('/index.html') || path.endsWith('index.html');
};

const getProjectUrl = (projectId) => `p_descript.html?id=${encodeURIComponent(projectId)}`;

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

// Desktop image (_0d) or mobile image (_0m), depending on screen width
function getResponsiveImage(images) {
  if (!Array.isArray(images)) return 'images/placeholder.png';

  const isMobile = window.matchMedia('(max-width: 863px)').matches;

  const desktopImg = images.find((img) => img.includes('_0d'));
  const mobileImg = images.find((img) => img.includes('_0m'));

  if (isMobile) {
    return mobileImg || desktopImg || images[0];
  }
  return desktopImg || images[0];
}

// Mobile shots (_0m) get this class so they keep their narrow proportions
const mobileShotClass = (src) => (src.includes('_0m') ? ' is-mobile-shot' : '');


/* =============================
   2. SHARED LAYOUT
============================= */

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


/* =============================
   3. NAVIGATION
============================= */

function initBreadcrumbs() {
  const bc = document.getElementById('breadcrumb');
  if (!bc) return;

  const path = window.location.pathname;
  const trail = [{ label: 'Home', url: 'index.html' }];

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

  if (path.includes('about.html')) {
    trail.push({ label: 'About Me', url: 'about.html' });
  }

  bc.innerHTML = trail
    .map((item, i) => (
      i === trail.length - 1
        ? `<span>${item.label}</span>`
        : `<a href="${item.url}">${item.label}</a>`
    ))
    .join(' <i class="fa-solid fa-angle-right mx-2"></i> ');
}

// index.html?section=projects → scrolls to that section after load
function handleSectionRedirect() {
  if (!isIndexPage()) return;

  const params = new URLSearchParams(window.location.search);
  const sectionId = params.get('section');
  if (!sectionId) return;

  const section = document.getElementById(sectionId);
  if (!section) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', 'index.html');
    }, 200);
  });
}

// Menu links: smooth scroll on the home page, redirect from other pages
function updateReusableMenuLinks() {
  const onIndex = isIndexPage();

  const links = document.querySelectorAll(
    'a[href*="section=projects"], a[href*="section=contact"], a[href="#projects"], a[href="#contact"], a[href="index.html#projects"], a[href="index.html#contact"]'
  );

  links.forEach((link) => {
    const href = link.getAttribute('href');

    let sectionId = '';
    if (href.includes('projects')) sectionId = 'projects';
    if (href.includes('contact')) sectionId = 'contact';
    if (!sectionId) return;

    if (onIndex) {
      link.setAttribute('href', `#${sectionId}`);

      link.addEventListener('click', (e) => {
        e.preventDefault();

        const section = document.getElementById(sectionId);
        if (!section) return;

        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// Home: the header appears when the projects section reaches the top
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
    const showHeader = rect.top <= window.innerHeight * 0.15;

    header.classList.toggle('show-project-header', showHeader);
  }

  window.addEventListener('scroll', update);
  window.addEventListener('resize', update);
  update();
}


/* =============================
   4. INTERACTIONS
============================= */

// ---------- Typewriter ----------
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

// ---------- Mosaic buttons ----------
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

// ---------- Mobile float button (back to top) ----------
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

    if (fadeOverlay) fadeOverlay.classList.add('show');

    setTimeout(() => {
      introSection.scrollIntoView({ behavior: 'smooth' });
      if (fadeOverlay) fadeOverlay.classList.remove('show');
    }, 350);
  });
}


/* =============================
   5. PROJECTS — HOME: CASE STUDIES SECTION
   Lead = the project with "lead": true (or the first featured one).
   Below it, up to 3 more featured projects as a list.
============================= */

function renderCaseStudies(data) {
  const leadBox = document.getElementById('cs-lead');
  const list = document.getElementById('cs-list');
  if (!leadBox || !list) return;

  const featured = data.projects.filter((p) => p.featured === true);
  const lead = featured.find((p) => p.lead === true) || featured[0];
  if (!lead) return;

  const others = featured.filter((p) => p !== lead).slice(0, 3);

  const leadImg = getResponsiveImage(lead.images);

  // ---------- Lead case ----------
  leadBox.innerHTML = `
    <a class="cs-lead" href="${getProjectUrl(lead.id)}">
      <div class="cs-lead-img${mobileShotClass(leadImg)}">
        <img src="${escapeHtml(leadImg)}"
             alt="${escapeHtml(lead.title)} preview" data-aos="zoom-in">
        <span class="cs-badge">Latest</span>
      </div>

      <div>
        <span class="cs-client">${escapeHtml([lead.client || lead.title, lead.agency].filter(Boolean).join(' · '))}</span>
        <h3>${escapeHtml(lead.headline || lead.title)}</h3>
        <p>${escapeHtml(lead.tagline || truncateText(lead.summary, 220))}</p>

        <dl class="cs-meta">
          <div><dt>Role</dt><dd>${escapeHtml(lead.role || lead.roles?.[0] || '')}</dd></div>
          <div><dt>Scope</dt><dd>${escapeHtml(lead.scope || lead.category || '')}</dd></div>
          <div><dt>Year</dt><dd>${escapeHtml(lead.year || '')}</dd></div>
        </dl>

        <span class="cs-link">Read the case study <i class="fa-solid fa-arrow-right-long"></i></span>
      </div>
    </a>`;

  // ---------- More case studies ----------
  list.innerHTML = others
    .map((p, i) => `
      <li>
        <a class="cs-row" href="${getProjectUrl(p.id)}">
          <span class="cs-num">${String(i + 2).padStart(2, '0')}</span>
          <div>
            <h4>${escapeHtml(p.title)}</h4>
            <p>${escapeHtml(p.tagline || truncateText(p.summary, 90))}</p>
          </div>
          <span class="cs-tag">${escapeHtml(p.scope || p.category || '')}</span>
          <i class="fa-solid fa-arrow-right-long cs-arrow" aria-hidden="true"></i>
        </a>
      </li>`)
    .join('');
}


/* =============================
   6. PROJECTS — ARCHIVE PAGE (projects.html)
   Lead project big on top, the rest in a two-column grid.
============================= */

// One card of the grid: image first, then category · year, title, tagline
function createArchiveProjectCard(project) {
  const img = getResponsiveImage(project.images);

  return `
    <a class="archive-item" href="${getProjectUrl(project.id)}" data-aos="fade-up">
      <div class="archive-item-img${mobileShotClass(img)}">
        <img src="${escapeHtml(img)}"
             alt="${escapeHtml(project.title)} preview"
             loading="lazy" decoding="async">
      </div>

      <div class="archive-item-copy">
        <span class="archive-item-meta">
          ${escapeHtml(project.scope || project.category || '')}
          ${project.year ? ` · ${escapeHtml(project.year)}` : ''}
        </span>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.tagline || truncateText(project.summary, 110))}</p>
        <span class="archive-item-link">
          View case study <i class="fa-solid fa-arrow-right-long"></i>
        </span>
      </div>
    </a>`;
}

function renderProjectsArchive(data) {
  const listing = document.getElementById('projects-listing');
  const heroContainer = document.querySelector('.projects-hero');
  if (!listing) return;

  // Same order as projects.json. The lead project goes in the hero.
  const lead = data.projects.find((p) => p.lead === true) || data.projects[0];
  const rest = data.projects.filter((p) => p !== lead);

  if (heroContainer && lead) {
    const leadImg = getResponsiveImage(lead.images);

    heroContainer.innerHTML = `
      <a class="archive-lead" href="${getProjectUrl(lead.id)}">
        <div class="archive-lead-img${mobileShotClass(leadImg)}">
          <img src="${escapeHtml(leadImg)}"
               alt="${escapeHtml(lead.title)} preview">
          <span class="archive-badge">Latest</span>
        </div>

        <div class="archive-lead-copy">
          <span class="archive-item-meta">${escapeHtml([lead.client || lead.category, lead.agency].filter(Boolean).join(' · '))}</span>
          <h2>${escapeHtml(lead.headline || lead.title)}</h2>
          <p>${escapeHtml(lead.tagline || lead.summary || '')}</p>
          <span class="archive-item-link">
            Read the case study <i class="fa-solid fa-arrow-right-long"></i>
          </span>
        </div>
      </a>`;
  }

  listing.innerHTML = rest.map(createArchiveProjectCard).join('');
}


/* =============================
   7. PROJECTS — DETAIL PAGE (p_descript.html)
   ONE layout for every project:
   Overview → chapters with decisions (image + caption) → Impact.
   Projects that still use challenge / solution are converted
   on the fly by getProjectChapters(), so nothing breaks while
   you move them to "chapters" one by one.
============================= */

// ---------- Header pieces ----------
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

// Client · Agency · Role · Scope · Year — only the fields the project has
function createProjectFacts(project) {
  const facts = [
    ['Client', project.client],
    ['Agency', project.agency],
    ['Role', project.role],
    ['Scope', project.scope],
    ['Year', project.year]
  ].filter(([, value]) => value);

  if (!facts.length && !project.credits) return '';

  return `
    <div class="project-facts" data-aos="fade-up">
      ${facts.length ? `
        <dl class="project-facts-list">
          ${facts.map(([label, value]) => `
            <div>
              <dt>${escapeHtml(label)}</dt>
              <dd>${label === 'Agency' && project.agencyUrl
                ? `<a href="${escapeHtml(project.agencyUrl)}" target="_blank" rel="noopener">${escapeHtml(String(value))}</a>`
                : escapeHtml(String(value))}</dd>
            </div>
          `).join('')}
        </dl>` : ''}
      ${project.credits ? `<p class="project-credits">${escapeHtml(project.credits)}</p>` : ''}
    </div>`;
}

// Scope at a glance — big numbers under the header (only if "stats" exists)
function createProjectStats(stats) {
  if (!Array.isArray(stats) || stats.length === 0) return '';

  return `
    <dl class="project-stats" data-aos="fade-up">
      ${stats.map((stat) => `
        <div>
          <dt>${escapeHtml(String(stat.value))}</dt>
          <dd>${escapeHtml(stat.label)}</dd>
        </div>
      `).join('')}
    </dl>`;
}

// ---------- Data: always return chapters ----------
// If the project has "chapters", use them.
// If not, build one chapter from challenge + solution.
function getProjectChapters(project) {
  if (Array.isArray(project.chapters) && project.chapters.length) {
    return project.chapters;
  }

  const decisions = [
    { title: 'The challenge', data: project.challenge },
    { title: 'The solution', data: project.solution }
  ]
    .filter((item) => item.data?.text)
    .map((item) => ({
      title: item.title,
      why: item.data.text,
      images: Array.isArray(item.data.images) ? item.data.images : []
    }));

  return decisions.length ? [{ decisions }] : [];
}

// ---------- Gallery ----------
// Adapts to how many images there are:
// 1 = full width · 2 = wide + narrow · 3+ = one big + two small
function createCaseGallery(images, caption) {
  if (!Array.isArray(images) || !images.length) return '';

  const size = images.length >= 3 ? 'is-3' : `is-${images.length}`;

  return `
    <div class="case-gallery ${size}">
      ${images.map((img, i) => `
        <a href="${escapeHtml(img)}" data-fancybox="gallery" data-caption="${escapeHtml(caption)}">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(caption)} — image ${i + 1}"
               loading="lazy" decoding="async">
        </a>
      `).join('')}
    </div>`;
}

// ---------- Overview / Impact block ----------
function createCaseIntro(title, section, extraClass = '') {
  if (!section?.text) return '';

  return `
    <section class="case-intro ${extraClass}" data-aos="fade-up">
      <h5>${escapeHtml(title)}</h5>
      <p>${escapeHtml(section.text)}</p>
    </section>
    ${section.images?.length ? `
      <div class="case-intro-media" data-aos="fade-up">
        ${createCaseGallery(section.images, title)}
      </div>` : ''}`;
}

// ---------- Whole story ----------
function createProjectStory(project) {
  const chapters = getProjectChapters(project);
  const showChapterHeads = chapters.length > 1 || Boolean(chapters[0]?.page);

  return `
    <div class="case-story">

      ${createCaseIntro('Overview', project.description)}

      ${chapters.map((chapter, c) => `
        <section class="case-chapter">
          ${showChapterHeads ? `
            <header class="case-chapter-head" data-aos="fade-up">
              <span class="case-chapter-num">${String(c + 1).padStart(2, '0')}</span>
              <div>
                <span class="case-chapter-label">${escapeHtml(chapter.label || '')}</span>
                <h2>${escapeHtml(chapter.page || '')}</h2>
                ${chapter.url ? `
                  <a class="case-chapter-link" href="${escapeHtml(chapter.url)}" target="_blank" rel="noopener">
                    View live page <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                  </a>` : ''}
              </div>
              ${chapter.intro ? `<p>${escapeHtml(chapter.intro)}</p>` : ''}
            </header>` : ''}

          ${(chapter.decisions || []).map((decision) => `
            <article class="case-decision" data-aos="fade-up">
              ${createCaseGallery(decision.images, decision.title)}
              <div class="case-caption">
                <h3>${escapeHtml(decision.title)}</h3>
                <p>${escapeHtml(decision.why)}</p>
              </div>
            </article>
          `).join('')}
        </section>
      `).join('')}

      ${createCaseIntro('Impact', project.impact, 'case-closing')}
    </div>`;
}

// ---------- Full detail page ----------
function renderProjectDetail(project) {
  const projectContainer = document.getElementById('projects-list');
  if (!projectContainer) return;

  const links = `
    <div class="project-links">
      ${project.live ? `<a href="${escapeHtml(project.live)}" target="_blank" rel="noreferrer" class="btn m_text">Live Site</a>` : ''}
      ${project.github ? `<a href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer" class="btn m_text">GitHub</a>` : ''}
    </div>`;

  projectContainer.innerHTML = `
    <section class="project-detail-shell">

      <div class="project-detail-head secondary-hero" data-aos="fade-up">
        <div class="project-head-copy">
          <h1>${escapeHtml(project.title || '')}</h1>
          ${project.subtitle ? `<h4>${escapeHtml(project.subtitle)}</h4>` : ''}
          <p class="project-summary">${escapeHtml(project.summary || '')}</p>
        </div>

        <div class="project-head-meta">
          ${createMetaBlock('What I did', project.roles)}
          ${createMetaBlock('Key Features', project.features)}
        </div>
      </div>

      ${createProjectFacts(project)}

      ${createProjectStats(project.stats)}

      ${links}

      <section class="project-layout">

        ${createProjectStory(project)}

        <div class="project-final-block">
          ${project.technologies?.length ? `
            <div class="meta-block">
              <h5>Technologies</h5>
              <p class="tech-inline">${project.technologies.map(escapeHtml).join(' • ')}</p>
            </div>` : ''}

          ${links}
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


/* =============================
   8. PROJECTS — INIT
   Each render function checks for its own container,
   so only the one that belongs to the current page runs.
============================= */

async function initProjects(data) {
  renderCaseStudies(data);       // index.html
  renderProjectsArchive(data);   // projects.html

  // Re-render on resize so desktop/mobile images switch
  if (document.getElementById('cs-lead') || document.getElementById('projects-listing')) {
    window.addEventListener('resize', () => {
      renderCaseStudies(data);
      renderProjectsArchive(data);
    });
  }

  // p_descript.html
  const detailContainer = document.getElementById('projects-list');
  if (!detailContainer) return;

  const projectId = new URLSearchParams(window.location.search).get('id');

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


/* =============================
   9. DESIGNER NOTES (d_notes.html)
============================= */

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
          <span class="color-swatch" style="background:${escapeHtml(color.value)}"></span>
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
    <div class="project-links mt-0 text-start">
      ${project.github ? `<a href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer" class="btn m_text">GitHub</a>` : ''}
    </div>`;

  // Gallery: diagrams on one side, sketches on the other
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
              <img src="${escapeHtml(item.image)}" data-aos="zoom-in"
                   alt="${escapeHtml(item.title)}" class="diag-img img-thum"
                   loading="lazy" decoding="async">
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
            <img src="${escapeHtml(item.image)}" data-aos="zoom-in"
                 alt="${escapeHtml(item.title)}" class="diag-img">
          </a>
        </article>
      `).join('')}
    </div>`;

  // Load SVG diagrams inline
  secDiag.querySelectorAll('.diagram-svg').forEach(async (el) => {
    try {
      const res = await fetch(el.dataset.src);
      el.innerHTML = await res.text();
    } catch (error) {
      console.error('Error loading SVG:', error);
    }
  });

  if (window.Fancybox) {
    Fancybox.bind("[data-fancybox='notes']", {
      infinite: false,
      Toolbar: true,
      closeButton: 'top'
    });
  }

  initMosaicButtons(pdnLink);
}


/* =============================
   10. RESUME (resume.html)
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
    </div>`;

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
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `title_item${topic === selectedTopic ? ' selected' : ''}`;
      button.innerHTML = `
        <span class="title_dot"></span>
        <span class="title_label">${escapeHtml(formatTopicLabel(topic))}</span>`;

      button.addEventListener('click', () => {
        selectedTopic = topic;
        renderTitles();
        renderDesc();
      });

      titlesCol.appendChild(button);
    });
  }

  function renderDesc() {
    descContent.innerHTML = '';
    const sectionData = aboutme[selectedTopic];
    if (!sectionData) return;

    // Simple list (skills, awards)
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

    // Education
    if (selectedTopic === 'education') {
      sectionData.forEach((item) => {
        const article = document.createElement('article');
        article.className = 'resume-entry';
        article.innerHTML = `
          <h3>${escapeHtml(item.institution)}</h3>
          <p class="resume-subtitle">${escapeHtml(item.degree).replace(/\n/g, '<br>')}</p>
          <p class="resume-date">${escapeHtml(item.graduation)}</p>`;
        descContent.appendChild(article);
      });
      return;
    }

    // Experience
    if (selectedTopic === 'experience') {
      sectionData.forEach((job) => {
        const article = document.createElement('article');
        article.className = 'resume-entry';
        article.innerHTML = `
          <h3>${escapeHtml(job.title)}</h3>
          <p class="resume-subtitle">${escapeHtml(job.organization)} — ${escapeHtml(job.location)}</p>
          <p class="resume-date">${escapeHtml(job.period)}</p>`;

        const ul = document.createElement('ul');
        ul.className = 'resume-list';

        job.responsibilities.forEach((responsibility) => {
          const li = document.createElement('li');
          li.textContent = responsibility;
          ul.appendChild(li);
        });

        article.appendChild(ul);
        descContent.appendChild(article);
      });
      return;
    }

    // Anything else
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


/* =============================
   11. ABOUT ME (about.html)
============================= */

function initAboutMe(data) {
  const aboutData = data.about_me?.[0];
  const sidebar = document.getElementById('sidebar');
  const displayBox = document.getElementById('display-box');

  if (!aboutData || !sidebar || !displayBox) return;

  let firstLoaded = false;

  const showProject = (item, itemDiv) => {
    const imgSrc = Array.isArray(item.image) ? item.image[0] : item.image;

    displayBox.innerHTML = `
      <img src="${escapeHtml(imgSrc)}" data-aos="zoom-in" alt="${escapeHtml(item.title)}">
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


/* =============================
   12. TESTIMONIALS (index.html)
============================= */

function initTestimonials(data) {
  const grid = document.getElementById('testimonials-grid');
  const section = document.getElementById('kind-words');
  if (!grid || !section) return;

  const testimonials = data.testimonials ?? [];

  // Si no hay testimonios, ocultamos la sección entera
  if (testimonials.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = '';

  grid.innerHTML = testimonials
    .map((t) => `
      <article class="testimonial">
        <div class="testimonial-top">
          <i class="fa-solid fa-quote-left" aria-hidden="true"></i>
        </div>
        ${renderTestimonialQuote(t.quote)}
        <footer>
          <strong class="text-xs uppercase">${escapeHtml(t.name)}</strong>
          <span>${escapeHtml(t.role)}</span>
        </footer>
      </article>
    `)
    .join('');

  grid.querySelectorAll('.testimonial-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const quote = btn.closest('.testimonial-quote');
      const expanded = quote.classList.toggle('is-expanded');
      btn.textContent = expanded ? 'Read less' : 'Read more';
      btn.setAttribute('aria-expanded', String(expanded));
    });
  });
}

// Long quotes show the first TESTIMONIAL_LIMIT characters (cut at a word) + "Read more"
const TESTIMONIAL_LIMIT = 260;

function renderTestimonialQuote(quote = '') {
  if (quote.length <= TESTIMONIAL_LIMIT) {
    return `<blockquote class="testimonial-quote">${escapeHtml(quote)}</blockquote>`;
  }

  const cut = quote.lastIndexOf(' ', TESTIMONIAL_LIMIT);
  const short = quote.slice(0, cut > 0 ? cut : TESTIMONIAL_LIMIT).replace(/[\s.,;:]+$/, '');

  return `
    <blockquote class="testimonial-quote">
      <span class="quote-short">${escapeHtml(short)}…</span>
      <span class="quote-full">${escapeHtml(quote)}</span>
      <button type="button" class="testimonial-toggle" aria-expanded="false">Read more</button>
    </blockquote>`;
}


/* =============================
   13. CONTACT FORM POPUP (index.html)
============================= */

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

  window.closePopup = closePopup;   // used by onclick in the HTML

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


/* =============================
   14. APP INIT
============================= */

async function initApp() {
  await injectSharedLayout();

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
    initTestimonials(data);
  } catch (error) {
    console.error('App initialization data error:', error);
  }
}

document.addEventListener('DOMContentLoaded', initApp);


/* =============================
   EASTER EGG FOR CURIOUS DEVELOPERS 👀
============================= */
console.log(
  '%c👋 Hey there, curious developer!',
  'font-size: 18px; font-weight: bold; color: #cc4433;'
);
console.log(
  "If you're poking around in the console, you probably appreciate good code as much as good design. I'm Gretel — I build sites like this one from scratch, no templates. Let's talk: gretelalvareztang@gmail.com"
);


/* =====================================================================
   ARCHIVE — features removed from the live site, kept for reference
   =====================================================================

// ---------- Logo color theme ----------
// This feature explores how color affects perception and user experience.
// It was intentionally removed from the final version to keep the interface
// focused and consistent, but kept here for reference.

function initLogoTheme() {
  const themeActive = sessionStorage.getItem('theme') === 'brand';
  document.body.classList.toggle('brand-mode', themeActive);

  const logo = document.getElementById('logo_container');
  if (!logo) return;

  let active = themeActive;

  logo.addEventListener('click', () => {
    active = !active;
    document.body.classList.toggle('brand-mode', active);

    if (active) sessionStorage.setItem('theme', 'brand');
    else sessionStorage.removeItem('theme');
  });
}

if (performance.navigation.type === 1) {
  sessionStorage.removeItem('theme');
}

// ---------- Mosaic logo ----------
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
        if (isTop) line.style.top = '-120%';
        else line.style.bottom = '-120%';
        line.style.opacity = '0';
      }, Math.random() * 80);

      setTimeout(() => line.remove(), 380);
    }
  }

  logo.addEventListener('mouseenter', burstLines);
  logo.addEventListener('mouseleave', burstLines);
}

   ===================================================================== */