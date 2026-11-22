import { Text, Area, NumberInput, ImageField } from '../components/fields.jsx';

export default function ProfileSection({ draft, setKey, notify }) {
  const profile = draft.profile;
  const links = draft.links;
  const images = draft.images;
  const p = (k) => (v) => setKey('profile', { ...profile, [k]: v });
  const l = (k) => (v) => setKey('links', { ...links, [k]: v });
  const im = (k) => (v) => setKey('images', { ...images, [k]: v });

  return (
    <>
      <section className="panel">
        <h2>Profile</h2>
        <p className="muted">Shown in the hero, about section, navbar and footer.</p>
        <div className="grid">
          <Text label="Full name" hint="Also used in the browser tab title and link previews" value={profile.name} onChange={p('name')} />
          <Text
            label="Monogram"
            hint="2–3 letters shown as the logo. Leave empty to use your initials."
            value={profile.monogram}
            onChange={p('monogram')}
            maxLength={4}
          />
          <NumberInput label="Years of experience" value={profile.yearsExperience} onChange={p('yearsExperience')} min={0} />
          <Text label="Role / headline" value={profile.role} onChange={p('role')} wide />
          <Text label="Availability note" hint="e.g. “Available for new projects”" value={profile.hireNote} onChange={p('hireNote')} wide />
          <Area label="Hero description" value={profile.heroDescription} onChange={p('heroDescription')} rows={3} />
          <Area label="Short bio" value={profile.shortBio} onChange={p('shortBio')} rows={3} />
        </div>
      </section>

      <section className="panel">
        <h2>Contact links</h2>
        <p className="muted">Leave a link empty to hide it on the site.</p>
        <div className="grid">
          <Text label="Email" type="email" value={links.email} onChange={l('email')} />
          <Text label="LinkedIn" value={links.linkedin} onChange={l('linkedin')} />
          <Text label="Telegram" value={links.telegram} onChange={l('telegram')} />
          <Text label="WhatsApp" value={links.whatsapp} onChange={l('whatsapp')} />
          <Text label="GitHub" value={links.github} onChange={l('github')} />
          <Text label="Booking / calendar URL" value={links.booking} onChange={l('booking')} />
          <Text
            label="Newsletter subscribe endpoint"
            hint="CRM URL the contact form's subscribe option posts to"
            value={draft.crmSubscribeUrl}
            onChange={(v) => setKey('crmSubscribeUrl', v)}
            wide
          />
        </div>
      </section>

      <section className="panel">
        <h2>Hero image</h2>
        <p className="muted">The large picture at the top of the home page. Leave empty to use the default artwork.</p>
        <div className="grid">
          <ImageField label="Hero image" value={images.hero} onChange={im('hero')} notify={notify} />
        </div>
      </section>
    </>
  );
}
