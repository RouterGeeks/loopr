import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { hasUpdateBlockers, useUpdateBlocked } from '../lib/updateSafety';

function ask(worker: ServiceWorker, type: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => { channel.port1.close(); reject(new Error('No response')); }, 4000);
    channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve(event.data?.allowed === true); };
    worker.postMessage({ type }, [channel.port2]);
  });
}
export default function UpdateNotice() {
  const blocked = useUpdateBlocked();
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [dismissed, setDismissed] = useState<ServiceWorker | null>(null);
  const [alone, setAlone] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const armed = useRef(false);
  useLayoutEffect(() => {
    const content = document.getElementById('loopr-content');
    if (content) content.inert = updating;
    return () => { if (content) content.inert = false; };
  }, [updating]);
  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
    let disposed = false;
    let registration: ServiceWorkerRegistration | undefined;
    const watch = () => { if (!disposed) setWaiting(registration?.waiting ?? null); };
    const changed = () => {
      if (armed.current && !hasUpdateBlockers()) window.location.reload();
      else watch(); // Never reload another window or discard a draft.
    };
    const refresh = () => {
      watch();
      if (document.visibilityState === 'visible') void registration?.update().catch(() => {});
    };
    const start = async () => {
      registration = await navigator.serviceWorker.ready;
      if (disposed) return;
      registration.addEventListener('updatefound', watch);
      watch();
      refresh();
    };
    void start();
    const poll = setInterval(watch, 2000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    navigator.serviceWorker.addEventListener('controllerchange', changed);
    return () => {
      disposed = true; clearInterval(poll);
      registration?.removeEventListener('updatefound', watch);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
      navigator.serviceWorker.removeEventListener('controllerchange', changed);
    };
  }, []);
  useEffect(() => {
    if (!waiting) return;
    let disposed = false;
    const check = () => { void ask(waiting, 'LOOPR_UPDATE_CHECK').then(value => { if (!disposed) setAlone(value); }).catch(() => { if (!disposed) setAlone(false); }); };
    check(); const timer = setInterval(check, 3000);
    return () => { disposed = true; clearInterval(timer); };
  }, [waiting]);
  if (!waiting || dismissed === waiting) return null;
  const update = async () => {
    if (armed.current || hasUpdateBlockers()) return;
    armed.current = true; setUpdating(true); setMessage('Checking open windows…');
    try {
      const allowed = await ask(waiting, 'LOOPR_UPDATE_ACTIVATE');
      if (!allowed) throw new Error('Other windows');
      setMessage('Updating Loopr…');
      // If activation stalls, stop blocking the app. Never force a later reload.
      setTimeout(() => {
        if (armed.current) { armed.current = false; setUpdating(false); setMessage('Update has not finished. Save your work, then close and reopen Loopr.'); }
      }, 10000);
    } catch {
      armed.current = false; setUpdating(false); setAlone(false);
      setMessage('Could not safely start the update. Close other Loopr windows and try again, or update by closing and reopening Loopr.');
    }
  };
  return <aside aria-label="App update" className="mx-auto my-3 max-w-xl rounded-md border border-lavender/50 bg-paper-light p-4 text-sm text-charcoal">
    <p role="status" className="font-semibold">A Loopr update is ready</p>
    <p id="update-help" className="mt-2">{blocked ? 'Save or cancel your open work before updating.' : !alone ? 'Close other Loopr tabs or app windows before updating. Waiting to confirm this is the only window.' : 'Your saved thoughts will stay on this device.'}</p>
    {message && <p role="status" className="mt-2">{message}</p>}
    <div className="mt-3 flex flex-wrap gap-3">
      <button type="button" disabled={updating} onClick={() => setDismissed(waiting)} className="min-h-11 rounded-md border border-rule px-4">Later</button>
      <button type="button" aria-describedby="update-help" disabled={blocked || !alone || updating} onClick={update} className="min-h-11 rounded-md bg-lavender/25 px-4 font-semibold disabled:opacity-50">Update now</button>
    </div>
  </aside>;
}
