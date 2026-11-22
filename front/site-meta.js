/**
 * Builds the page <title> and meta tags (description, author, Open Graph…) from the
 * site content, so the browser tab and link previews always show the saved name/role.
 *
 * Used by vite.config.ts (dev server + static GitHub Pages build) and by the portfolio
 * server, which applies it to every page it serves using the live content.
 * Each call rewrites the full tag values, so applying it more than once is safe.
 */
const escapeHtml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export function siteMeta(content) {
  const p = content?.profile ?? {};
  const name = p.name || 'Portfolio';
  const title = p.role ? `${name} | ${p.role}` : name;
  const keywords = [
    ...new Set([name, ...(content?.domains ?? []).flatMap((d) => [d.title, ...(d.technologies ?? [])])]),
  ].slice(0, 25);
  return {
    title,
    description: p.shortBio ? `${name} — ${p.shortBio}` : title,
    author: name,
    keywords: keywords.join(', '),
    ogTitle: title,
    ogDescription: p.heroDescription || p.shortBio || title,
  };
}

export function applySiteMeta(html, content) {
  const m = siteMeta(content);
  const setMeta = (attr, key, value) => {
    const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`);
    html = html.replace(re, (_, start, end) => start + escapeHtml(value) + end);
  };
  html = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(m.title)}</title>`);
  setMeta('name', 'description', m.description);
  setMeta('name', 'author', m.author);
  setMeta('name', 'keywords', m.keywords);
  setMeta('property', 'og:title', m.ogTitle);
  setMeta('property', 'og:description', m.ogDescription);
  return html;
}
