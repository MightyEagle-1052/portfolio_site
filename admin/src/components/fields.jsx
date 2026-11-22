import { useEffect, useRef, useState } from 'react';
import { api, assetUrl } from '../api.js';

export function Field({ label, hint, children, wide }) {
  return (
    <label className={`field${wide ? ' field--wide' : ''}`}>
      {label && <span className="field__label">{label}</span>}
      {children}
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  );
}

export function Text({ label, hint, value, onChange, wide, ...rest }) {
  return (
    <Field label={label} hint={hint} wide={wide}>
      <input className="input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
    </Field>
  );
}

export function NumberInput({ label, hint, value, onChange, allowEmpty, ...rest }) {
  return (
    <Field label={label} hint={hint}>
      <input
        className="input"
        type="number"
        value={value ?? ''}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? (allowEmpty ? undefined : 0) : Number(v));
        }}
        {...rest}
      />
    </Field>
  );
}

export function Area({ label, hint, value, onChange, rows = 4, wide = true }) {
  return (
    <Field label={label} hint={hint} wide={wide}>
      <textarea className="input textarea" rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** Tag-style input for short lists (technologies). Enter or comma adds; × removes. */
export function Chips({ label, hint, value = [], onChange, placeholder = 'Type and press Enter' }) {
  const [text, setText] = useState('');
  const add = (raw) => {
    const items = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !value.includes(s));
    if (items.length) onChange([...value, ...items]);
    setText('');
  };
  return (
    <Field label={label} hint={hint} wide>
      <div className="chips">
        {value.map((item, i) => (
          <span className="chip" key={`${item}-${i}`}>
            {item}
            <button type="button" aria-label={`Remove ${item}`} onClick={() => onChange(value.filter((_, j) => j !== i))}>
              ×
            </button>
          </span>
        ))}
        <input
          className="chips__input"
          value={text}
          placeholder={value.length ? '' : placeholder}
          onChange={(e) => {
            const v = e.target.value;
            if (v.includes(',')) add(v);
            else setText(v);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add(text);
            } else if (e.key === 'Backspace' && !text && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => text && add(text)}
        />
      </div>
    </Field>
  );
}

/** One item per line (features, responsibilities). */
export function Lines({ label, hint, value = [], onChange, rows = 5 }) {
  const [text, setText] = useState(value.join('\n'));
  const toList = (t) => t.split('\n').map((s) => s.trim()).filter(Boolean);
  useEffect(() => {
    // Sync when the value changes from outside (e.g. switching projects or discarding).
    if (toList(text).join('\n') !== value.join('\n')) setText(value.join('\n'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <Field label={label} hint={hint || 'One item per line'} wide>
      <textarea
        className="input textarea"
        rows={rows}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(toList(e.target.value));
        }}
      />
    </Field>
  );
}

export function Thumb({ src, className = '' }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);
  if (!src || broken) return <div className={`thumb thumb--empty ${className}`}>No image</div>;
  return <img className={`thumb ${className}`} src={assetUrl(src)} alt="" loading="lazy" onError={() => setBroken(true)} />;
}

function useUploader(onDone, notify) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const pick = () => inputRef.current?.click();
  const onFiles = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = '';
    if (!files.length) return;
    setBusy(true);
    try {
      onDone(await api.upload(files));
    } catch (err) {
      notify?.(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  return { inputRef, busy, pick, onFiles };
}

/** Single image: preview + path/URL + upload. */
export function ImageField({ label, hint, value, onChange, notify }) {
  const up = useUploader((urls) => urls[0] && onChange(urls[0]), notify);
  return (
    <Field label={label} hint={hint || 'Upload an image, or paste a URL / site path like /project_images/…'} wide>
      <div className="image-field">
        <Thumb src={value} />
        <div className="image-field__controls">
          <input className="input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="https://… or /uploads/…" />
          <div className="row">
            <button type="button" className="btn btn--small" onClick={up.pick} disabled={up.busy}>
              {up.busy ? 'Uploading…' : 'Upload image'}
            </button>
            {value && (
              <button type="button" className="btn btn--small btn--ghost" onClick={() => onChange('')}>
                Clear
              </button>
            )}
          </div>
        </div>
        <input ref={up.inputRef} type="file" accept="image/*" hidden onChange={up.onFiles} />
      </div>
    </Field>
  );
}

/** Gallery of images with reorder / remove / multi-upload. */
export function ImageList({ label, hint, value = [], onChange, notify }) {
  const up = useUploader((urls) => onChange([...value, ...urls]), notify);
  const [url, setUrl] = useState('');
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <Field label={label} hint={hint} wide>
      <div className="gallery">
        {value.map((src, i) => (
          <div className="gallery__item" key={`${src}-${i}`}>
            <Thumb src={src} />
            <div className="gallery__actions">
              <button type="button" title="Move left" onClick={() => move(i, -1)} disabled={i === 0}>
                ←
              </button>
              <span>{i + 1}</span>
              <button type="button" title="Move right" onClick={() => move(i, 1)} disabled={i === value.length - 1}>
                →
              </button>
              <button type="button" title="Remove" className="danger" onClick={() => onChange(value.filter((_, j) => j !== i))}>
                ✕
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="gallery__add" onClick={up.pick} disabled={up.busy}>
          {up.busy ? 'Uploading…' : '+ Upload images'}
        </button>
      </div>
      <div className="row" style={{ marginTop: 8 }}>
        <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="…or add by URL / path" />
        <button
          type="button"
          className="btn btn--small"
          disabled={!url.trim()}
          onClick={() => {
            onChange([...value, url.trim()]);
            setUrl('');
          }}
        >
          Add
        </button>
      </div>
      <input ref={up.inputRef} type="file" accept="image/*" multiple hidden onChange={up.onFiles} />
    </Field>
  );
}

/** Editable list of objects shown as collapsible cards. */
export function ObjectList({ items = [], onChange, renderItem, titleOf, newItem, addLabel = 'Add item', empty }) {
  const [open, setOpen] = useState(() => new Set());
  const toggle = (i) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  const update = (i, patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen((s) => {
      const n = new Set();
      s.forEach((k) => n.add(k === i ? j : k === j ? i : k));
      return n;
    });
  };
  const remove = (i) => {
    if (!confirm(`Delete "${titleOf(items[i]) || 'this item'}"?`)) return;
    onChange(items.filter((_, j) => j !== i));
    setOpen(new Set());
  };
  return (
    <div className="olist">
      {items.length === 0 && empty && <p className="muted">{empty}</p>}
      {items.map((item, i) => (
        <div className={`card${open.has(i) ? ' card--open' : ''}`} key={i}>
          <div className="card__head" onClick={() => toggle(i)}>
            <span className="card__caret">{open.has(i) ? '▾' : '▸'}</span>
            <span className="card__title">{titleOf(item) || <em className="muted">Untitled</em>}</span>
            <span className="card__tools" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="icon-btn" title="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                ↑
              </button>
              <button type="button" className="icon-btn" title="Move down" onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                ↓
              </button>
              <button type="button" className="icon-btn danger" title="Delete" onClick={() => remove(i)}>
                ✕
              </button>
            </span>
          </div>
          {open.has(i) && <div className="card__body grid">{renderItem(item, (patch) => update(i, patch), i)}</div>}
        </div>
      ))}
      <button
        type="button"
        className="btn btn--ghost"
        onClick={() => {
          onChange([...items, newItem()]);
          setOpen((s) => new Set(s).add(items.length));
        }}
      >
        + {addLabel}
      </button>
    </div>
  );
}
