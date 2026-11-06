import { useEffect, useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle, Linkedin, Github, MessageSquare, Phone, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LINKS, CRM_SUBSCRIBE_URL, DOMAINS } from '@/data/site';
import { SectionHeading, Reveal } from './Shared';

type Status = 'idle' | 'sending' | 'success' | 'error';
const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [smsOptIn, setSmsOptIn] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY, string>>>({});
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const subject = (e as CustomEvent<{ subject?: string }>).detail?.subject;
      if (subject) setForm((f) => ({ ...f, subject }));
    };
    window.addEventListener('prefill-contact', onPrefill);
    return () => window.removeEventListener('prefill-contact', onPrefill);
  }, []);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er: typeof errors = {};
    if (form.name.trim().length < 2) er.name = 'Please enter your name.';
    if (!EMAIL_RE.test(form.email.trim())) er.email = 'Please enter a valid email address.';
    if (form.phone.trim() && form.phone.replace(/\D/g, '').length < 7) er.phone = 'Please enter a valid phone number or leave it blank.';
    if (form.subject.trim().length < 3) er.subject = 'Please add a subject.';
    if (form.message.trim().length < 10) er.message = 'Please write at least 10 characters.';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      subject: form.subject.trim(),
      message: form.message.trim(),
    };
    try {
      const [dbRes, crmRes] = await Promise.allSettled([
        supabase.from('contact_messages').insert(payload),
        fetch(CRM_SUBSCRIBE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: payload.email,
            name: payload.name,
            phone: payload.phone || undefined,
            sms_opt_in: smsOptIn === true,
            source: 'contact-form',
            tags: ['contact-form', 'portfolio-inquiry'],
          }),
        }),
      ]);
      const dbOk = dbRes.status === 'fulfilled' && !dbRes.value.error;
      const crmOk = crmRes.status === 'fulfilled' && crmRes.value.ok;
      if (!dbOk && !crmOk) throw new Error('Submission failed');
      setStatus('success');
      setForm(EMPTY);
      setSmsOptIn(true);
    } catch {
      setStatus('error');
    }
  };

  const field = 'w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20';
  const errCls = (k: keyof typeof EMPTY) => (errors[k] ? 'border-destructive' : 'border-input');

  return (
    <section id="contact" className="relative overflow-hidden section-alt py-20 md:py-28">
      <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-[hsl(var(--violet)/0.12)] blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Let's Build Something <span className="text-gradient">Amazing.</span>
            </>
          }
          description="Have an interesting project involving AI, Computer Vision, 3D Visualization, AR/VR, or Game Development? Let's discuss how we can turn your ideas into practical digital solutions."
        />

        <div className="grid gap-8 lg:grid-cols-5">
          <Reveal className="space-y-4 lg:col-span-2">
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface card-hover group flex items-center gap-4 p-5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A66C2] text-white">
                <Linkedin className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold">LinkedIn</p>
                <p className="truncate text-sm text-muted-foreground">Connect or send a direct message</p>
              </div>
            </a>
            <a
              href={LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface card-hover group flex items-center gap-4 p-5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#229ED9] text-white">
                <Send className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold">Telegram</p>
                <p className="truncate text-sm text-muted-foreground">@MightyEagle1052</p>
              </div>
            </a>
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface card-hover group flex items-center gap-4 p-5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366] text-white">
                <Phone className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold">WhatsApp</p>
                <p className="truncate text-sm text-muted-foreground">+63 975 973 8697</p>
              </div>
            </a>
            {LINKS.github && (
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="card-surface card-hover flex items-center gap-4 p-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                  <Github className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-semibold">GitHub</p>
                  <p className="text-sm text-muted-foreground">Browse code and repositories</p>
                </div>
              </a>
            )}
            <a href={`mailto:${LINKS.email}`} className="card-surface card-hover flex items-center gap-4 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white">
                <Mail className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold">Email</p>
                <p className="truncate text-sm text-muted-foreground">{LINKS.email}</p>
              </div>
            </a>
            <div className="card-surface p-6">
              <p className="text-sm font-semibold">I can help with</p>
              <ul className="mt-3 space-y-2">
                {DOMAINS.map((d) => (
                  <li key={d.key} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${d.accent.gradient}`} /> {d.title}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-3" delay={100}>
            <div className="card-surface h-full p-6 sm:p-8">
              {status === 'success' ? (
                <div className="flex flex-col items-center py-12 text-center animate-fade-in" role="status">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <h3 className="mt-5 text-2xl font-bold">Message sent</h3>
                  <p className="mt-2 max-w-sm text-muted-foreground">Thanks for reaching out — your message has been received and I'll reply by email soon.</p>
                  <button onClick={() => setStatus('idle')} className="mt-6 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary/50">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-5">
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <MessageSquare className="h-5 w-5 text-primary" /> Send a message
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium">Name</label>
                      <input id="c-name" value={form.name} onChange={set('name')} autoComplete="name" className={`${field} ${errCls('name')}`} placeholder="Your name" />
                      {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium">Email</label>
                      <input id="c-email" type="email" value={form.email} onChange={set('email')} autoComplete="email" className={`${field} ${errCls('email')}`} placeholder="you@company.com" />
                      {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-phone" className="mb-1.5 block text-sm font-medium">Phone number (optional)</label>
                      <input id="c-phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" className={`${field} ${errCls('phone')}`} placeholder="+1 555 000 0000" />
                      {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="c-subject" className="mb-1.5 block text-sm font-medium">Subject</label>
                      <input id="c-subject" value={form.subject} onChange={set('subject')} className={`${field} ${errCls('subject')}`} placeholder="Project inquiry" />
                      {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-message" className="mb-1.5 block text-sm font-medium">Message</label>
                    <textarea
                      id="c-message"
                      rows={5}
                      value={form.message}
                      onChange={set('message')}
                      className={`${field} ${errCls('message')} resize-y`}
                      placeholder="Tell me about your project, goals and timeline..."
                    />
                    {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={smsOptIn}
                      onChange={(e) => setSmsOptIn(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
                    />
                    <span>Text me updates. Msg & data rates may apply. Reply STOP to unsubscribe.</span>
                  </label>

                  {status === 'error' && (
                    <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm" role="alert">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      <p>
                        Your message couldn't be sent right now. Please try again, or reach me directly on{' '}
                        <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
                          LinkedIn
                        </a>
                        .
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 disabled:opacity-70 sm:w-auto"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
