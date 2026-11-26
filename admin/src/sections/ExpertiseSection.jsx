import { useEffect, useState } from 'react';
import { Text, Area, Chips, Select } from '../components/fields.jsx';
import { AREA_COLORS, AREA_ICONS, defaultHighlight } from '../api.js';

const MAX_TAG_LENGTH = 24;

// Swatch colors for the picker, close to how each color looks on the site.
const SWATCHES = {
  cyan: '#06b6d4',
  violet: '#8b5cf6',
  blue: '#3b82f6',
  green: '#10b981',
  amber: '#f59e0b',
  red: '#f43f5e',
  orange: '#f97316',
  pink: '#ec4899',
  teal: '#14b8a6',
  gray: '#64748b',
};

const ICON_LABELS = {
  brain: 'Brain',
  box: '3D box',
  glasses: 'VR glasses',
  gamepad: 'Gamepad',
  code: 'Code',
  cpu: 'Chip',
  database: 'Database',
  cloud: 'Cloud',
  phone: 'Phone',
  globe: 'Globe',
  shield: 'Shield',
  chart: 'Chart',
  palette: 'Palette',
  bot: 'Robot',
  layers: 'Layers',
  rocket: 'Rocket',
  wrench: 'Wrench',
  server: 'Server',
  camera: 'Camera',
  map: 'Map',
  microscope: 'Microscope',
  stethoscope: 'Stethoscope',
  car: 'Car',
  plane: 'Plane',
  factory: 'Factory',
  leaf: 'Leaf',
  music: 'Music',
  graduation: 'Graduation cap',
  sparkles: 'Sparkles',
};
const ICON_OPTIONS = AREA_ICONS.map((value) => ({ value, label: ICON_LABELS[value] || value }));

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function ColorPicker({ value, onChange }) {
  // Not a <label>: clicking a label would also press its first button.
  return (
    <div className="field field--wide">
      <span className="field__label">Color</span>
      <div className="swatches" role="radiogroup" aria-label="Color">
        {AREA_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={value === c}
            title={capitalize(c)}
            className={`swatch${value === c ? ' is-on' : ''}`}
            style={{ background: SWATCHES[c] }}
            onClick={() => onChange(c)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * The tag is applied when the field loses focus (or on Enter), not on every key press, so renaming
 * never briefly gives two areas the same tag (their projects would be merged).
 */
function TagInput({ value, otherTags, onCommit }) {
  const [text, setText] = useState(value);
  const [error, setError] = useState('');
  useEffect(() => setText(value), [value]);
  const commit = () => {
    const tag = text.trim();
    if (tag === value) return setText(value);
    const problem = !tag
      ? 'The tag cannot be empty.'
      : otherTags.some((t) => t.toLowerCase() === tag.toLowerCase())
        ? `Another area already uses "${tag}".`
        : '';
    setError(problem);
    if (problem) setText(value);
    else onCommit(tag);
  };
  return (
    <label className="field">
      <span className="field__label">Project tag</span>
      <input
        className={`input${error ? ' input--error' : ''}`}
        value={text}
        maxLength={MAX_TAG_LENGTH}
        onChange={(e) => {
          setText(e.target.value);
          setError('');
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
        }}
      />
      <span className={`field__hint${error ? ' field__hint--error' : ''}`}>
        {error || 'Short label on project cards and filters. Renaming it also renames it on your projects.'}
      </span>
    </label>
  );
}

export default function ExpertiseSection({ draft, setKey, notify }) {
  const domains = draft.domains;
  const isVisible = (d) => d.visible !== false;
  const update = (i, patch) => setKey('domains', domains.map((d, j) => (j === i ? { ...d, ...patch } : d)));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= domains.length) return;
    const next = [...domains];
    [next[i], next[j]] = [next[j], next[i]];
    setKey('domains', next);
  };
  const visibleCount = domains.filter(isVisible).length;

  // Projects point to an area by its tag, so a renamed tag is renamed on the projects too.
  const renameTag = (i, tag) => {
    const old = domains[i].tag;
    update(i, { tag });
    setKey('projects', draft.projects.map((p) => (p.tags.includes(old) ? { ...p, tags: p.tags.map((t) => (t === old ? tag : t)) } : p)));
  };

  const add = () => {
    const keys = new Set(domains.map((d) => d.key));
    const tags = new Set(domains.map((d) => d.tag.toLowerCase()));
    let n = 1;
    while (keys.has(n === 1 ? 'new-area' : `new-area-${n}`) || tags.has(n === 1 ? 'new' : `new ${n}`)) n++;
    const usedColors = new Set(domains.map((d) => d.color));
    setKey('domains', [
      ...domains,
      {
        key: n === 1 ? 'new-area' : `new-area-${n}`,
        tag: n === 1 ? 'New' : `New ${n}`,
        color: AREA_COLORS.find((c) => !usedColors.has(c)) || 'gray',
        icon: 'sparkles',
        title: 'New area',
        short: '',
        description: '',
        technologies: [],
        visible: true,
        highlight: '',
      },
    ]);
  };

  const remove = (i) => {
    const area = domains[i];
    if (domains.length === 1) return notify('Keep at least one area. Add another one before deleting this one.', 'error');
    const rest = domains.filter((_, j) => j !== i);
    const target = rest[0];
    const projects = draft.projects.filter((p) => p.tags.includes(area.tag));
    const capabilities = draft.capabilities.filter((c) => c.domain === area.key);
    const categories = draft.skillCategories.filter((c) => c.domain === area.key);
    const moved = capabilities.length + categories.length;

    const lines = [`Delete the area "${area.title || area.tag}"?`];
    if (projects.length) lines.push(`• ${plural(projects.length, 'project loses', 'projects lose')} the tag "${area.tag}".`);
    if (moved) {
      const what = [
        capabilities.length && plural(capabilities.length, 'capability', 'capabilities'),
        categories.length && plural(categories.length, 'skill category', 'skill categories'),
      ].filter(Boolean);
      lines.push(`• ${what.join(' and ')} ${moved === 1 ? 'moves' : 'move'} to "${target.title || target.tag}".`);
    }
    lines.push('', 'To keep the area but not show it, turn off "Visible on site" instead.');
    if (!confirm(lines.join('\n'))) return;

    setKey('domains', rest);
    if (projects.length) {
      setKey('projects', draft.projects.map((p) => (p.tags.includes(area.tag) ? { ...p, tags: p.tags.filter((t) => t !== area.tag) } : p)));
    }
    if (capabilities.length) {
      setKey('capabilities', draft.capabilities.map((c) => (c.domain === area.key ? { ...c, domain: target.key } : c)));
    }
    if (categories.length) {
      setKey('skillCategories', draft.skillCategories.map((c) => (c.domain === area.key ? { ...c, domain: target.key } : c)));
    }
  };

  return (
    <section className="panel">
      <h2>Areas of expertise</h2>
      <p className="muted">
        Add, delete and reorder your areas. The order here is the priority on the site: the Expertise cards, hero chips and badges,
        About, Contact, Footer, stats and project filters all follow it. Hidden areas are left out of those lists, but their projects
        keep the tag.
      </p>
      {visibleCount === 0 && <div className="alert">All areas are hidden. The Expertise section on the site will be empty.</div>}

      {domains.map((d, i) => (
        <div className={`subpanel area${isVisible(d) ? '' : ' area--hidden'}`} key={d.key}>
          <div className="area__head">
            <span className="area__rank" title="Priority">
              {i + 1}
            </span>
            <span className="area__dot" style={{ background: SWATCHES[d.color] }} aria-hidden />
            <h3>{d.title || 'Untitled area'}</h3>
            <span className="pill">{d.tag}</span>
            {!isVisible(d) && <span className="pill">Hidden</span>}
            <div className="area__tools">
              <button type="button" className="btn btn--small btn--ghost" onClick={() => move(i, -1)} disabled={i === 0} title="Higher priority">
                ↑ Up
              </button>
              <button
                type="button"
                className="btn btn--small btn--ghost"
                onClick={() => move(i, 1)}
                disabled={i === domains.length - 1}
                title="Lower priority"
              >
                ↓ Down
              </button>
              <label className="switch" title={isVisible(d) ? 'Shown on the site' : 'Hidden from the site'}>
                <input type="checkbox" checked={isVisible(d)} onChange={(e) => update(i, { visible: e.target.checked })} />
                <span className="switch__track" aria-hidden />
                Visible on site
              </label>
              <button
                type="button"
                className="btn btn--small btn--danger"
                onClick={() => remove(i)}
                disabled={domains.length === 1}
                title={domains.length === 1 ? 'Keep at least one area' : 'Delete this area'}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="grid">
            <Text label="Title" value={d.title} onChange={(v) => update(i, { title: v })} />
            <Text label="Subtitle" value={d.short} onChange={(v) => update(i, { short: v })} />
            <Area label="Description" value={d.description} onChange={(v) => update(i, { description: v })} rows={2} />
            <TagInput value={d.tag} otherTags={domains.filter((_, j) => j !== i).map((x) => x.tag)} onCommit={(t) => renameTag(i, t)} />
            <Select label="Icon" value={d.icon} onChange={(v) => update(i, { icon: v })} options={ICON_OPTIONS} />
            <ColorPicker value={d.color} onChange={(v) => update(i, { color: v })} />
            <Text
              label="Hero badge text"
              hint="Short line on this area's floating badge next to your hero photo. Leave empty for the default."
              placeholder={defaultHighlight(d)}
              value={d.highlight}
              onChange={(v) => update(i, { highlight: v })}
              wide
            />
            <Chips label="Technologies" value={d.technologies} onChange={(v) => update(i, { technologies: v })} />
          </div>
        </div>
      ))}

      <button type="button" className="btn btn--ghost area__add" onClick={add}>
        + Add area
      </button>
    </section>
  );
}
