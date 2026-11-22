import { Text, Area, Chips, Lines, Select, ObjectList, ImageField } from '../components/fields.jsx';
import { DOMAINS } from '../api.js';

const DOMAIN_OPTIONS = DOMAINS.map((d) => ({ value: d.key, label: d.label }));

export function ExperienceSection({ draft, setKey }) {
  return (
    <>
      <section className="panel">
        <h2>Work experience</h2>
        <p className="muted">Employment history. While this list is empty, the site shows your capabilities and selected projects instead.</p>
        <ObjectList
          items={draft.experience}
          onChange={(v) => setKey('experience', v)}
          titleOf={(e) => [e.position, e.organization].filter(Boolean).join(' — ')}
          newItem={() => ({ position: '', organization: '', period: '', responsibilities: [], technologies: [] })}
          addLabel="Add position"
          empty="No positions yet."
          renderItem={(e, update) => (
            <>
              <Text label="Position" value={e.position} onChange={(v) => update({ position: v })} />
              <Text label="Organization" value={e.organization} onChange={(v) => update({ organization: v })} />
              <Text label="Period" hint="e.g. 2021 – Present" value={e.period} onChange={(v) => update({ period: v })} />
              <Lines label="Responsibilities" value={e.responsibilities} onChange={(v) => update({ responsibilities: v })} />
              <Chips label="Technologies" value={e.technologies} onChange={(v) => update({ technologies: v })} />
            </>
          )}
        />
      </section>

      <section className="panel">
        <h2>Capabilities</h2>
        <p className="muted">Professional capability cards in the Experience section.</p>
        <ObjectList
          items={draft.capabilities}
          onChange={(v) => setKey('capabilities', v)}
          titleOf={(c) => c.title}
          newItem={() => ({ domain: 'ai', title: '', text: '' })}
          addLabel="Add capability"
          renderItem={(c, update) => (
            <>
              <Text label="Title" value={c.title} onChange={(v) => update({ title: v })} />
              <Select label="Domain" value={c.domain} onChange={(v) => update({ domain: v })} options={DOMAIN_OPTIONS} />
              <Area label="Text" value={c.text} onChange={(v) => update({ text: v })} rows={3} />
            </>
          )}
        />
      </section>
    </>
  );
}

export function TestimonialsSection({ draft, setKey, notify }) {
  return (
    <section className="panel">
      <h2>Testimonials</h2>
      <p className="muted">Only add authentic testimonials. The section is hidden on the site while this list is empty.</p>
      <ObjectList
        items={draft.testimonials}
        onChange={(v) => setKey('testimonials', v)}
        titleOf={(t) => [t.name, t.company].filter(Boolean).join(' — ')}
        newItem={() => ({ name: '', position: '', company: '', quote: '' })}
        addLabel="Add testimonial"
        empty="No testimonials yet."
        renderItem={(t, update) => (
          <>
            <Text label="Name" value={t.name} onChange={(v) => update({ name: v })} />
            <Text label="Position" value={t.position} onChange={(v) => update({ position: v })} />
            <Text label="Company" value={t.company} onChange={(v) => update({ company: v })} />
            <Area label="Quote" value={t.quote} onChange={(v) => update({ quote: v })} rows={4} />
            <ImageField label="Photo (optional)" value={t.image} onChange={(v) => update({ image: v })} notify={notify} />
          </>
        )}
      />
    </section>
  );
}
