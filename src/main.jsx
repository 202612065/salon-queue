import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation, useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  Sparkles, Clock, Users, ArrowRight, Plus, Check,
  Play, CheckCircle2, AlertCircle, Languages, X,
  Settings, Tv, ClipboardList, Home as HomeIcon, Scissors
} from 'lucide-react';
import './style.css';
import { lastRouteSegment } from './route-segment.js';

const API = import.meta.env.VITE_API_URL || '';
const req = async (url, opts = {}) => {
  const r = await fetch(`${API}/api${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  const data = await r.json();
  if (!r.ok) throw Object.assign(new Error(data.error || 'Something went wrong'), { data });
  return data;
};

const en = {
  home: 'Home',
  join: 'Get Token',
  status: 'My Pass',
  reception: 'Front Desk',
  barber: 'Stylist View',
  display: 'Lounge TV',
  admin: 'Owner Settings',
  open: 'Doors Open',
  closed: 'Queue Paused',
  waiting: 'Waiting',
  called: 'Called',
  chair: 'In Chair',
  done: 'Done',
  cancelled: 'Cancelled',
  noshow: 'No-show',
  services: 'Atelier Menu',
  barberChoice: 'Choose Stylist',
  any: 'Any Available Stylist',
  confirm: 'Confirm Queue Spot',
  queue: 'Live Queue',
  people: 'Guests Waiting',
  wait: 'Est. Wait',
  name: 'Your Name',
  phone: 'Mobile Number (10 digits)',
  choose: 'Select up to 3 services',
  total: 'Total Amount',
  minutes: 'mins',
  price: 'Price',
  yourTurn: 'YOUR CHAIR IS READY!',
  coming: 'Please walk in now — your stylist is waiting.',
  cancelSpot: 'Cancel Spot',
  callNext: 'Call Next',
  addWalkin: 'Add Walk-In',
  start: 'Start Session',
  finish: 'Mark Done',
  break: 'Take Break',
  available: 'Back on Floor',
  upNext: 'Up Next',
  now: 'Now',
  save: 'Save Settings',
  queueOpen: 'Online Queue Joining',
  closeTime: 'Closing Time',
  stats: 'Today’s Summary',
  served: 'Guests Served',
  avg: 'Avg. Wait',
  noShows: 'No-Shows',
  language: 'ગુજરાતી'
};

const gu = {
  home: 'હોમ',
  join: 'ટોકન લો',
  status: 'મારો પાસ',
  reception: 'ફ્રન્ટ ડેસ્ક',
  barber: 'સ્ટાઇલિસ્ટ વ્યૂ',
  display: 'લોન્જ ટીવી',
  admin: 'માલિક સેટિંગ્સ',
  open: 'કતાર ચાલુ',
  closed: 'કતાર બંધ',
  waiting: 'રાહમાં',
  called: 'બોલાવ્યા',
  chair: 'સેવામાં',
  done: 'પૂર્ણ',
  cancelled: 'રદ',
  noshow: 'ગેરહાજર',
  services: 'સેવા મેનુ',
  barberChoice: 'પસંદગીના સ્ટાઇલિસ્ટ',
  any: 'કોઈપણ ઉપલબ્ધ સ્ટાઇલિસ્ટ',
  confirm: 'ટોકન કન્ફર્મ કરો',
  queue: 'લાઇવ કતાર',
  people: 'રાહ જોતા મહેમાનો',
  wait: 'અંદાજિત સમય',
  name: 'તમારું નામ',
  phone: 'મોબાઇલ નંબર (10 અંક)',
  choose: 'વધુમાં વધુ 3 સેવા પસંદ કરો',
  total: 'કુલ રકમ',
  minutes: 'મિનિટ',
  price: 'કિંમત',
  yourTurn: 'તમારો વારો આવી ગયો છે!',
  coming: 'કૃપા કરીને અંદર આવો — તમારી ખુરશી તૈયાર છે.',
  cancelSpot: 'જગ્યા રદ કરો',
  callNext: 'આગળનાને બોલાવો',
  addWalkin: 'વોક-ઇન ઉમેરો',
  start: 'શરૂ કરો',
  finish: 'પૂર્ણ કરો',
  break: 'વિરામ પર',
  available: 'ઉપલબ્ધ',
  upNext: 'આગળનો વારો',
  now: 'અત્યારે',
  save: 'સાચવો',
  queueOpen: 'ઓનલાઇન જોડાવું',
  closeTime: 'બંધ થવાનો સમય',
  stats: 'આજનો સારાંશ',
  served: 'સેવા લીધેલા મહેમાનો',
  avg: 'સરેરાશ રાહ',
  noShows: 'ગેરહાજર',
  language: 'English'
};

function App() {
  const [lang, setLang] = useState('en');
  const [data, setData] = useState({
    services: [],
    barbers: [],
    queue: [],
    settings: { queueOpen: true, salonClose: '21:00', salonName: 'MAISON ROSE' }
  });
  const [toast, setToast] = useState('');
  const location = useLocation();
  const isStaff =
    ['/reception', '/admin', '/display'].includes(location.pathname) ||
    location.pathname.startsWith('/barber/');
  const t = lang === 'en' ? en : gu;

  const refresh = async () => {
    try {
      setData(await req('/snapshot'));
    } catch {
      setToast('Cannot connect to server. Please check that the API is running.');
    }
  };

  useEffect(() => {
    refresh();
    const socket = io(API || window.location.origin, { path: '/socket.io' });
    socket.on('snapshot', setData);
    const timer = setInterval(refresh, 4500);
    return () => {
      socket.disconnect();
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(''), 3500);
      return () => clearTimeout(id);
    }
  }, [toast]);

  const action = async (fn) => {
    try {
      await fn();
      await refresh();
    } catch (e) {
      if (e.data?.existingId) {
        window.location.href = `/status/${e.data.existingId}`;
      } else {
        setToast(e.message);
      }
    }
  };

  return (
    <div className="rosewood-app">
      <header className="rose-header">
        <Link to="/" className="rose-brand">
          <span className="rose-monogram"><Scissors size={18} /></span>
          <div>
            <strong>{data.settings.salonName || 'MAISON ROSE'}</strong>
            <small>HAIR & BEAUTY ATELIER</small>
          </div>
        </Link>

        {isStaff ? (
          <nav className="rose-nav">
            <Link to="/reception" className={location.pathname === '/reception' ? 'active' : ''}>
              <ClipboardList size={14} /> {t.reception}
            </Link>
            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
              <Settings size={14} /> {t.admin}
            </Link>
            <Link to="/display" className={location.pathname === '/display' ? 'active' : ''}>
              <Tv size={14} /> {t.display}
            </Link>
            <Link to="/" className="rose-home-pill">
              <HomeIcon size={14} /> {t.home}
            </Link>
          </nav>
        ) : (
          <nav className="rose-nav">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>{t.home}</Link>
            <Link to="/join" className={location.pathname === '/join' ? 'active' : ''}>{t.services}</Link>
            <Link to="/reception">Staff</Link>
          </nav>
        )}

        <div className="rose-actions">
          <button className="lang-pill" onClick={() => setLang(lang === 'en' ? 'gu' : 'en')}>
            <Languages size={15} />
            <span>{t.language}</span>
          </button>
          {!isStaff && (
            <Link
              to={data.settings.queueOpen ? '/join' : '#'}
              className={`btn-blush sm ${!data.settings.queueOpen ? 'disabled' : ''}`}
            >
              {t.join} <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </header>

      {toast && (
        <div className="rose-toast">
          <AlertCircle size={17} />
          <span>{toast}</span>
          <button onClick={() => setToast('')}><X size={15} /></button>
        </div>
      )}

      <Routes data={data} t={t} lang={lang} action={action} />

      <footer className="rose-footer">
        <div>
          <strong>{data.settings.salonName || 'MAISON ROSE'}</strong> · Calm appointments, live queue updates.
        </div>
        <div className="rose-footer-links">
          <Link to="/reception">{t.reception}</Link>
          <span>/</span>
          <Link to="/display">{t.display}</Link>
          <span>/</span>
          <Link to="/admin">{t.admin}</Link>
        </div>
      </footer>
    </div>
  );
}

function Routes({ data, t, lang, action }) {
  const p = useLocation().pathname;
  if (p === '/') return <Home data={data} t={t} lang={lang} />;
  if (p === '/join') return <Join data={data} t={t} lang={lang} action={action} />;
  if (p.startsWith('/status/')) return <Status data={data} t={t} />;
  if (p === '/reception') return <Reception data={data} t={t} action={action} />;
  if (p.startsWith('/barber/')) return <Barber data={data} t={t} action={action} />;
  if (p === '/display') return <Display data={data} t={t} />;
  if (p === '/admin') return <Admin data={data} t={t} action={action} />;
  return <Home data={data} t={t} lang={lang} />;
}

function Home({ data, t, lang }) {
  const waiting = data.queue.filter(x => x.status === 'Waiting');
  const activeBarbers = data.barbers.filter(b => b.active && !b.onBreak);
  const open = data.settings.queueOpen;
  const estWait = Math.ceil(
    waiting.reduce((a, x) => a + x.minutes, 0) / Math.max(1, activeBarbers.length)
  );

  return (
    <main className="rose-main">
      <section className="blush-banner">
        <span className={`state-chip ${open ? 'open' : 'closed'}`}>
          <i /> {open ? t.open : t.closed} · Closes {data.settings.salonClose}
        </span>
        <h1>
          Effortless style,<br />
          <em>timed around your day.</em>
        </h1>
        <p>
          Join the live queue from anywhere, watch your spot move in real time, and step in only when your chair is ready.
        </p>
      </section>

      <section className="stats-row-3">
        <div className="blush-stat">
          <Users size={20} />
          <div>
            <strong>{waiting.length}</strong>
            <span>{t.people}</span>
          </div>
        </div>
        <div className="blush-stat">
          <Clock size={20} />
          <div>
            <strong>{waiting.length === 0 ? 'Walk in' : `~${estWait} ${t.minutes}`}</strong>
            <span>{t.wait}</span>
          </div>
        </div>
        <div className="blush-stat">
          <Sparkles size={20} />
          <div>
            <strong>{activeBarbers.length}</strong>
            <span>Stylists Ready</span>
          </div>
        </div>
      </section>

      <section className="home-two-col">
        <div className="white-panel">
          <div className="panel-head">
            <span className="rose-eyebrow">THE TEAM</span>
            <h2>Stylists on Duty</h2>
          </div>
          <div className="stylist-list">
            {data.barbers.map((b, i) => {
              const busy = data.queue.some(q => q.barber_id === b.id && q.status === 'In chair');
              const statusLabel = !b.active ? 'Off Duty' : b.onBreak ? 'On Break' : busy ? 'With Guest' : 'Available';
              const statusTone = !b.active || b.onBreak ? 'off' : busy ? 'busy' : 'ready';
              return (
                <div className="stylist-item" key={b.id}>
                  <div className="stylist-initial">{b.name[0]}</div>
                  <div className="stylist-info">
                    <b>{b.name}</b>
                    <small>Chair 0{i + 1}</small>
                  </div>
                  <span className={`tone-badge ${statusTone}`}>{statusLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="white-panel">
          <div className="panel-head">
            <span className="rose-eyebrow">{t.services.toUpperCase()}</span>
            <h2>Popular Treatments</h2>
          </div>
          <div className="menu-preview-list">
            {data.services.filter(s => s.active).slice(0, 4).map(s => (
              <div className="menu-preview-row" key={s.id}>
                <div>
                  <b>{lang === 'gu' && s.gu ? s.gu : s.name}</b>
                  <small>{s.minutes} {t.minutes}</small>
                </div>
                <strong>₹{s.price}</strong>
              </div>
            ))}
          </div>
          <Link
            to={open ? '/join' : '#'}
            className={`btn-blush full mt-16 ${!open ? 'disabled' : ''}`}
          >
            {open ? 'Start Queue Check-In' : 'Queue Closed'} <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Join({ data, t, lang, action }) {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', barberId: 'any' });
  const [selected, setSelected] = useState([]);

  const chosen = data.services.filter(s => selected.includes(s.id));
  const total = chosen.reduce((a, s) => a + s.price, 0);
  const mins = chosen.reduce((a, s) => a + s.minutes, 0);
  const activeBarbers = data.barbers.filter(b => b.active && !b.onBreak);
  const estWait = Math.ceil(
    data.queue.filter(q => q.status === 'Waiting').reduce((a, x) => a + x.minutes, 0) /
    Math.max(1, activeBarbers.length)
  );

  const toggleService = (id) => {
    setSelected(old =>
      old.includes(id)
        ? old.filter(x => x !== id)
        : old.length < 3
          ? [...old, id]
          : old
    );
  };

  const submit = () =>
    action(async () => {
      if (!form.name.trim()) throw Error('Please enter your name.');
      if (!/^\d{10}$/.test(form.phone)) throw Error('Enter a valid 10-digit mobile number.');
      if (!selected.length) throw Error('Choose at least one service.');
      const res = await req('/queue', {
        method: 'POST',
        body: JSON.stringify({ ...form, serviceIds: selected })
      });
      nav(`/status/${res.id}`);
    });

  return (
    <main className="rose-main">
      <div className="page-header-row">
        <div>
          <span className="rose-eyebrow">LIVE QUEUE</span>
          <h1>Reserve Your Spot</h1>
        </div>
      </div>

      <div className="join-grid">
        <div className="join-steps">
          <div className="white-panel">
            <span className="step-num">STEP 1</span>
            <h2>Guest Details</h2>
            <div className="two-inputs">
              <label>
                {t.name}
                <input
                  placeholder="e.g. Ananya Desai"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label>
                {t.phone}
                <input
                  inputMode="numeric"
                  maxLength="10"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                />
              </label>
            </div>
          </div>

          <div className="white-panel">
            <span className="step-num">STEP 2</span>
            <h2>{t.choose}</h2>
            <div className="service-tiles">
              {data.services.filter(s => s.active).map(s => {
                const isPicked = selected.includes(s.id);
                return (
                  <button
                    type="button"
                    key={s.id}
                    className={`service-tile ${isPicked ? 'picked' : ''}`}
                    onClick={() => toggleService(s.id)}
                  >
                    <div className="tile-top">
                      <b>{lang === 'gu' && s.gu ? s.gu : s.name}</b>
                      <span className="tile-check">{isPicked ? <Check size={14} /> : <Plus size={14} />}</span>
                    </div>
                    <div className="tile-meta">
                      <span>{s.minutes} {t.minutes}</span>
                      <strong>₹{s.price}</strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="white-panel">
            <span className="step-num">STEP 3</span>
            <h2>{t.barberChoice}</h2>
            <div className="choice-chips">
              <button
                type="button"
                className={`choice-chip ${form.barberId === 'any' ? 'picked' : ''}`}
                onClick={() => setForm({ ...form, barberId: 'any' })}
              >
                <Sparkles size={15} /> {t.any}
              </button>
              {activeBarbers.map(b => (
                <button
                  type="button"
                  key={b.id}
                  className={`choice-chip ${form.barberId === b.id ? 'picked' : ''}`}
                  onClick={() => setForm({ ...form, barberId: b.id })}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="summary-box">
          <span className="rose-eyebrow">PASS SUMMARY</span>
          <h3>Your Visit</h3>
          <div className="summary-items">
            {chosen.length ? (
              chosen.map(s => (
                <div className="summary-row" key={s.id}>
                  <span>{s.name}</span>
                  <b>₹{s.price}</b>
                </div>
              ))
            ) : (
              <p className="muted-note">No services selected yet.</p>
            )}
          </div>
          <div className="summary-row">
            <span>Estimated Duration</span>
            <b>{mins} {t.minutes}</b>
          </div>
          <div className="summary-row">
            <span>{t.wait}</span>
            <b>~{estWait} {t.minutes}</b>
          </div>
          <div className="summary-total-row">
            <span>{t.total}</span>
            <strong>₹{total}</strong>
          </div>
          <button
            className="btn-blush full lg"
            disabled={!data.settings.queueOpen || !selected.length}
            onClick={submit}
          >
            {data.settings.queueOpen ? t.confirm : 'Queue Closed'} <ArrowRight size={17} />
          </button>
          <small className="summary-fine">Pay directly at the atelier after service.</small>
        </aside>
      </div>
    </main>
  );
}

function Status({ data, t }) {
  const location = useLocation();
  const id = lastRouteSegment(location.pathname);
  const [entry, setEntry] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [loadError, setLoadError] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    let alive = true;
    const load = () =>
      req(`/queue/${encodeURIComponent(id)}`)
        .then(x => {
          if (alive) {
            setEntry(x);
            setLoadError('');
          }
        })
        .catch(e => {
          if (alive) setLoadError(e.message || 'Unable to load your queue pass.');
        });
    load();
    const timer = setInterval(load, 3500);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [id]);

  if (!entry) {
    return (
      <main className="rose-main">
        <div className="white-panel center-card">
          <h2>{loadError || 'Loading your queue pass…'}</h2>
        </div>
      </main>
    );
  }

  const ahead = data.queue.filter(
    q =>
      q.status === 'Waiting' &&
      q.created_at < entry.created_at &&
      (!entry.barber_id || !q.barber_id || q.barber_id === entry.barber_id)
  );
  const position = ahead.length + 1;
  const wait = Math.ceil(
    ahead.reduce((a, q) => a + q.minutes, 0) /
    Math.max(1, data.barbers.filter(b => b.active && !b.onBreak).length)
  );

  return (
    <main className="rose-main">
      <div className={`pass-card ${entry.status === 'Called' ? 'called-glow' : ''}`}>
        <div className="pass-top">
          <span>{data.settings.salonName}</span>
          <span className="pass-badge">{entry.status}</span>
        </div>

        <div className="pass-center">
          <small>YOUR QUEUE TOKEN</small>
          <div className="pass-number">{entry.token}</div>
          <h2>{entry.name}</h2>
        </div>

        {entry.status === 'Called' && (
          <div className="alert-strip called">
            <strong>{t.yourTurn}</strong>
            <span>{t.coming} ({entry.barber_name})</span>
          </div>
        )}

        {entry.status === 'Waiting' && position === 2 && (
          <div className="alert-strip heads-up">
            You’re 2nd in line — please start heading toward the salon.
          </div>
        )}

        <div className="pass-info-3">
          <div>
            <small>POSITION</small>
            <b>{entry.status === 'In chair' ? 'In Chair' : entry.status === 'Done' ? 'Done' : `#${position}`}</b>
          </div>
          <div>
            <small>{t.wait.toUpperCase()}</small>
            <b>{entry.status === 'Called' ? t.now : `~${wait} ${t.minutes}`}</b>
          </div>
          <div>
            <small>STYLIST</small>
            <b>{entry.barber_name}</b>
          </div>
        </div>

        {entry.status === 'Waiting' && (
          <button className="btn-rose-outline full" onClick={() => setConfirm(true)}>
            {t.cancelSpot}
          </button>
        )}
      </div>

      {confirm && (
        <div className="rose-modal-backdrop">
          <div className="rose-modal">
            <h3>Cancel your spot?</h3>
            <p>Token {entry.token} will be released from today’s queue.</p>
            <div className="modal-actions">
              <button className="btn-rose-outline" onClick={() => setConfirm(false)}>Keep Spot</button>
              <button
                className="btn-blush"
                onClick={() => {
                  req(`/queue/${id}/status`, {
                    method: 'PATCH',
                    body: JSON.stringify({ status: 'Cancelled' })
                  })
                    .then(() => nav('/'))
                    .catch(() => {});
                  setConfirm(false);
                }}
              >
                Cancel Spot
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Reception({ data, t, action }) {
  const [walk, setWalk] = useState(false);
  const [recent, setRecent] = useState([]);
  const [f, setF] = useState({ name: '', phone: '', serviceIds: [], barberId: 'any' });

  useEffect(() => {
    req('/recent').then(setRecent).catch(() => {});
  }, [data.queue.length]);

  const active = data.queue.filter(q => ['Waiting', 'Called', 'In chair'].includes(q.status));
  const waitingRows = active.filter(q => q.status !== 'In chair');

  const update = (id, status) =>
    action(() =>
      req(`/queue/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
    );

  const call = (b) => {
    const next = active
      .filter(q => q.status === 'Waiting' && (!q.barber_id || q.barber_id === b.id))
      .sort((a, c) => a.created_at.localeCompare(c.created_at))[0];
    if (!next) return;
    action(() =>
      req(`/queue/${next.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Called', barberId: b.id })
      })
    );
  };

  return (
    <main className="rose-main wide">
      <div className="page-header-row">
        <div>
          <span className="rose-eyebrow">{t.reception.toUpperCase()}</span>
          <h1>Queue & Chair Desk</h1>
        </div>
        <div className="header-btn-group">
          {data.barbers.map(b => (
            <a key={b.id} href={`/barber/${b.id}`} target="_blank" rel="noreferrer" className="mini-link-pill">
              {b.name} ↗
            </a>
          ))}
          <button className="btn-blush" onClick={() => setWalk(true)}>
            <Plus size={16} /> {t.addWalkin}
          </button>
        </div>
      </div>

      <div className="chairs-3col">
        {data.barbers.map(b => {
          const current = active.find(q => q.barber_id === b.id && q.status === 'In chair');
          const called = active.find(q => q.barber_id === b.id && q.status === 'Called');
          const hasWaiting = active.some(q => q.status === 'Waiting' && (!q.barber_id || q.barber_id === b.id));
          return (
            <div className="white-panel chair-box" key={b.id}>
              <div className="chair-head">
                <b>{b.name}</b>
                <span className={`tone-badge ${!b.active || b.onBreak ? 'off' : current ? 'busy' : 'ready'}`}>
                  {!b.active ? 'Off Duty' : b.onBreak ? 'On Break' : current ? 'In Chair' : 'Free'}
                </span>
              </div>
              {current ? (
                <div className="chair-guest-box">
                  <b>{current.token} · {current.name}</b>
                  <small>{(current.serviceNames || []).join(', ')}</small>
                </div>
              ) : called ? (
                <div className="chair-guest-box called">
                  <b>CALLED: {called.token} · {called.name}</b>
                  <small>Awaiting arrival</small>
                </div>
              ) : (
                <div className="chair-idle">No guest in chair</div>
              )}
              <button
                className="btn-blush full sm"
                disabled={!b.active || b.onBreak || !!current || !!called || !hasWaiting}
                onClick={() => call(b)}
              >
                {t.callNext} <ArrowRight size={15} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="white-panel mt-20">
        <div className="panel-head-inline">
          <h2>{t.queue} ({waitingRows.length})</h2>
          <span className="muted-note">Earliest arrival first</span>
        </div>
        {waitingRows.length === 0 ? (
          <div className="empty-state-box">
            <Users size={28} />
            <b>No guests waiting right now.</b>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="rose-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Guest</th>
                  <th>Services</th>
                  <th>Stylist</th>
                  <th>Waited</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {waitingRows.map(q => {
                  const waited = Math.max(0, Math.floor((Date.now() - new Date(q.created_at)) / 60000));
                  return (
                    <tr key={q.id}>
                      <td><strong>{q.token}</strong></td>
                      <td>{q.name}</td>
                      <td>{(q.serviceNames || []).join(', ')}</td>
                      <td>{q.barber_name}</td>
                      <td className={waited > 60 ? 'long-wait' : ''}>{waited} {t.minutes}</td>
                      <td><span className="status-tag">{q.status}</span></td>
                      <td className="row-actions">
                        {q.status === 'Called' && (
                          <button onClick={() => update(q.id, 'In chair')}>Start</button>
                        )}
                        {q.status === 'Called' &&
                          q.called_at &&
                          Date.now() - new Date(q.called_at).getTime() >= 600000 && (
                            <button onClick={() => update(q.id, 'No-show')}>No-show</button>
                          )}
                        {q.status === 'Waiting' && (
                          <button onClick={() => update(q.id, 'Cancelled')}>Cancel</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {recent.length > 0 && (
        <div className="white-panel mt-20">
          <h3>Recent No-Shows & Cancelled</h3>
          <div className="table-wrap">
            <table className="rose-table">
              <thead>
                <tr><th>Token</th><th>Guest</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {recent.map(q => (
                  <tr key={q.id}>
                    <td><strong>{q.token}</strong></td>
                    <td>{q.name}</td>
                    <td>{q.status}</td>
                    <td>
                      {q.status === 'No-show' && (
                        <button
                          className="btn-rose-outline sm"
                          onClick={() =>
                            action(async () => {
                              await req(`/queue/${q.id}/rejoin`, { method: 'POST' });
                              setRecent(await req('/recent'));
                            })
                          }
                        >
                          Re-add at End
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {walk && (
        <div className="rose-modal-backdrop">
          <div className="rose-modal">
            <button className="modal-x" onClick={() => setWalk(false)}><X size={18} /></button>
            <h3>{t.addWalkin}</h3>
            <label>
              {t.name}
              <input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
            </label>
            <label>
              {t.phone}
              <input
                maxLength="10"
                value={f.phone}
                onChange={e => setF({ ...f, phone: e.target.value.replace(/\D/g, '') })}
              />
            </label>
            <label>
              {t.services} (up to 3)
              <select
                multiple
                value={f.serviceIds}
                onChange={e =>
                  setF({
                    ...f,
                    serviceIds: [...e.target.selectedOptions].map(o => o.value).slice(0, 3)
                  })
                }
              >
                {data.services.filter(s => s.active).map(s => (
                  <option key={s.id} value={s.id}>{s.name} (₹{s.price})</option>
                ))}
              </select>
            </label>
            <div className="modal-actions">
              <button className="btn-rose-outline" onClick={() => setWalk(false)}>Cancel</button>
              <button
                className="btn-blush"
                onClick={() =>
                  action(async () => {
                    await req('/walkin', { method: 'POST', body: JSON.stringify(f) });
                    setWalk(false);
                    setF({ name: '', phone: '', serviceIds: [], barberId: 'any' });
                  })
                }
              >
                Add Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Barber({ data, t, action }) {
  const location = useLocation();
  const name = lastRouteSegment(location.pathname);
  const b =
    data.barbers.find(x => x.id === name) ||
    data.barbers.find(x => x.name.toLowerCase() === name.toLowerCase());

  if (!b) return <main className="rose-main"><h1>Stylist not found</h1></main>;

  const current = data.queue.find(q => q.barber_id === b.id && q.status === 'In chair');
  const called = data.queue.find(q => q.barber_id === b.id && q.status === 'Called');
  const next = data.queue.find(q => q.status === 'Waiting' && (!q.barber_id || q.barber_id === b.id));

  return (
    <main className="rose-main">
      <div className="page-header-row">
        <div>
          <span className="rose-eyebrow">{t.barber.toUpperCase()}</span>
          <h1>{b.name}’s Chair</h1>
        </div>
        <button
          className="btn-rose-outline"
          onClick={() =>
            action(() =>
              req(`/barbers/${b.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ onBreak: !b.onBreak })
              })
            )
          }
        >
          {b.onBreak ? t.available : t.break}
        </button>
      </div>

      <div className="home-two-col">
        <div className="white-panel">
          <span className="step-num">ACTIVE SESSION</span>
          {current ? (
            <>
              <div className="big-rose-token">{current.token}</div>
              <h2>{current.name}</h2>
              <p className="muted-note">{(current.serviceNames || []).join(', ')} · {current.minutes} {t.minutes}</p>
              <button
                className="btn-blush full lg mt-16"
                onClick={() =>
                  action(() =>
                    req(`/queue/${current.id}/status`, {
                      method: 'PATCH',
                      body: JSON.stringify({ status: 'Done' })
                    })
                  )
                }
              >
                <CheckCircle2 size={18} /> {t.finish}
              </button>
            </>
          ) : called ? (
            <>
              <div className="big-rose-token">{called.token}</div>
              <h2>{called.name} (Called)</h2>
              <p className="muted-note">{(called.serviceNames || []).join(', ')}</p>
              <button
                className="btn-blush full lg mt-16"
                onClick={() =>
                  action(() =>
                    req(`/queue/${called.id}/status`, {
                      method: 'PATCH',
                      body: JSON.stringify({ status: 'In chair' })
                    })
                  )
                }
              >
                <Play size={18} /> {t.start}
              </button>
            </>
          ) : (
            <div className="empty-state-box">
              <Scissors size={30} />
              <b>Your chair is open.</b>
            </div>
          )}
        </div>

        <div className="white-panel">
          <span className="step-num">{t.upNext.toUpperCase()}</span>
          {next ? (
            <>
              <div className="med-rose-token">{next.token}</div>
              <h3>{next.name}</h3>
              <p className="muted-note">{(next.serviceNames || []).join(', ')}</p>
            </>
          ) : (
            <p className="muted-note">No guests waiting for your chair.</p>
          )}
        </div>
      </div>
    </main>
  );
}

function Display({ data, t }) {
  const waiting = data.queue.filter(q => q.status === 'Waiting').slice(0, 5);
  const active = data.queue.filter(q => q.status === 'In chair');
  const called = data.queue.filter(q => q.status === 'Called');

  return (
    <main className="lounge-tv">
      <div className="tv-banner">
        <h1>{data.settings.salonName} · Live Queue</h1>
        <span>Please watch for your token</span>
      </div>

      <div className="tv-grid-3">
        <section className="tv-panel">
          <h2>IN CHAIR ({active.length})</h2>
          {active.length ? (
            active.map(q => (
              <div className="tv-entry" key={q.id}>
                <strong>{q.token}</strong>
                <div>
                  <b>{q.name}</b>
                  <span>With {q.barber_name}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="tv-muted">Chairs ready</p>
          )}
        </section>

        <section className="tv-panel featured-tv">
          <h2>CALLED NOW ({called.length})</h2>
          {called.length ? (
            called.map(q => (
              <div className="tv-entry called-entry" key={q.id}>
                <strong>{q.token}</strong>
                <div>
                  <b>{q.name}</b>
                  <span>Please see {q.barber_name}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="tv-muted">No active call right now</p>
          )}
        </section>

        <section className="tv-panel">
          <h2>{t.upNext.toUpperCase()}</h2>
          {waiting.length ? (
            waiting.map(q => (
              <div className="tv-next-line" key={q.id}>
                <strong>{q.token}</strong>
                <span>{q.name}</span>
                <small>{q.barber_name}</small>
              </div>
            ))
          ) : (
            <p className="tv-muted">No wait time</p>
          )}
        </section>
      </div>
    </main>
  );
}

function Admin({ data, t, action }) {
  const [stats, setStats] = useState({ served: 0, averageWait: 0, noShows: 0 });
  const [close, setClose] = useState(data.settings.salonClose);
  const [add, setAdd] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', gu: '', minutes: 30, price: 100 });

  useEffect(() => {
    req('/stats').then(setStats).catch(() => {});
  }, [data.queue.length]);

  return (
    <main className="rose-main wide">
      <div className="page-header-row">
        <div>
          <span className="rose-eyebrow">{t.admin.toUpperCase()}</span>
          <h1>Atelier Controls</h1>
        </div>
      </div>

      <div className="stats-row-3">
        <div className="white-panel">
          <span className="muted-note">{t.served}</span>
          <strong className="big-stat">{stats.served}</strong>
        </div>
        <div className="white-panel">
          <span className="muted-note">{t.avg}</span>
          <strong className="big-stat">{stats.averageWait} {t.minutes}</strong>
        </div>
        <div className="white-panel">
          <span className="muted-note">{t.noShows}</span>
          <strong className="big-stat">{stats.noShows}</strong>
        </div>
      </div>

      <div className="home-two-col mt-20">
        <div className="white-panel">
          <div className="panel-head-inline">
            <h2>{t.services}</h2>
            <button className="btn-blush sm" onClick={() => setAdd(true)}>+ Add Service</button>
          </div>
          {data.services.map(s => (
            <div className="setting-row" key={s.id}>
              <div>
                <b>{s.name}</b>
                <small>{s.minutes} {t.minutes} · ₹{s.price}</small>
              </div>
              <input
                type="checkbox"
                checked={s.active}
                onChange={e =>
                  action(() =>
                    req(`/services/${s.id}`, {
                      method: 'PATCH',
                      body: JSON.stringify({ active: e.target.checked })
                    })
                  )
                }
              />
            </div>
          ))}
        </div>

        <div className="join-steps">
          <div className="white-panel">
            <h2>Queue & Hours</h2>
            <div className="setting-row">
              <div>
                <b>{t.queueOpen}</b>
                <small>Allow guests to join remotely</small>
              </div>
              <input
                type="checkbox"
                checked={data.settings.queueOpen}
                onChange={e =>
                  action(() =>
                    req('/settings', {
                      method: 'PATCH',
                      body: JSON.stringify({ queueOpen: e.target.checked })
                    })
                  )
                }
              />
            </div>
            <div className="setting-row">
              <b>{t.closeTime}</b>
              <div className="row-actions">
                <input type="time" value={close} onChange={e => setClose(e.target.value)} />
                <button
                  className="btn-blush sm"
                  onClick={() =>
                    action(() =>
                      req('/settings', {
                        method: 'PATCH',
                        body: JSON.stringify({ salonClose: close })
                      })
                    )
                  }
                >
                  {t.save}
                </button>
              </div>
            </div>
          </div>

          <div className="white-panel">
            <h2>Stylists on Duty</h2>
            {data.barbers.map(b => (
              <div className="setting-row" key={b.id}>
                <div>
                  <b>{b.name}</b>
                  <small>{b.onBreak ? 'On Break' : b.active ? 'Active' : 'Off Duty'}</small>
                </div>
                <input
                  type="checkbox"
                  checked={b.active}
                  onChange={e =>
                    action(() =>
                      req(`/barbers/${b.id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({ active: e.target.checked })
                      })
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {add && (
        <div className="rose-modal-backdrop">
          <div className="rose-modal">
            <h3>Add New Service</h3>
            {[
              ['id', 'Service ID'],
              ['name', 'English Name'],
              ['gu', 'Gujarati Name'],
              ['minutes', 'Minutes'],
              ['price', 'Price (₹)']
            ].map(([k, label]) => (
              <label key={k}>
                {label}
                <input
                  type={['minutes', 'price'].includes(k) ? 'number' : 'text'}
                  value={form[k]}
                  onChange={e => setForm({ ...form, [k]: e.target.value })}
                />
              </label>
            ))}
            <div className="modal-actions">
              <button className="btn-rose-outline" onClick={() => setAdd(false)}>Cancel</button>
              <button
                className="btn-blush"
                onClick={() =>
                  action(async () => {
                    await req('/services', { method: 'POST', body: JSON.stringify(form) });
                    setAdd(false);
                  })
                }
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);