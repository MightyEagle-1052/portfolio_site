import { Text, Select, ObjectList, Thumb } from '../components/fields.jsx';
import { areaOptions } from '../api.js';

function SkillRows({ skills, onChange }) {
  const update = (i, patch) => onChange(skills.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  return (
    <div className="field field--wide">
      <span className="field__label">Skills</span>
      <div className="skill-rows">
        {skills.map((s, i) => (
          <div className="skill-row" key={i}>
            <Thumb src={s.logo} className="thumb--icon" />
            <input className="input" placeholder="Skill name" value={s.name} onChange={(e) => update(i, { name: e.target.value })} />
            <input
              className="input"
              placeholder="Logo URL (optional)"
              value={s.logo ?? ''}
              onChange={(e) => update(i, { logo: e.target.value })}
            />
            <button type="button" className="icon-btn danger" title="Remove" onClick={() => onChange(skills.filter((_, j) => j !== i))}>
              ✕
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn--small btn--ghost" onClick={() => onChange([...skills, { name: '' }])}>
        + Add skill
      </button>
      <span className="field__hint">
        Logos: devicon URLs work well, e.g. https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg
      </span>
    </div>
  );
}

export default function SkillsSection({ draft, setKey }) {
  // 'web' is an extra style for categories that belong to no area.
  const domainOptions = [...areaOptions(draft.domains), { value: 'web', label: 'Web Development' }];
  return (
    <section className="panel">
      <h2>Skills</h2>
      <p className="muted">Skill categories shown in the Skills section. Skills without a logo show a letter badge.</p>
      <ObjectList
        items={draft.skillCategories}
        onChange={(v) => setKey('skillCategories', v)}
        titleOf={(c) => `${c.title} · ${c.skills.length} skills`}
        newItem={() => ({ title: 'New category', domain: draft.domains[0]?.key ?? 'web', skills: [] })}
        addLabel="Add category"
        renderItem={(c, update) => (
          <>
            <Text label="Category title" value={c.title} onChange={(v) => update({ title: v })} />
            <Select label="Color / area" value={c.domain} onChange={(v) => update({ domain: v })} options={domainOptions} />
            <SkillRows skills={c.skills} onChange={(v) => update({ skills: v })} />
          </>
        )}
      />
    </section>
  );
}
