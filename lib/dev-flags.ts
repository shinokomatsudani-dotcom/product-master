type DevFlags = {
  forceLoading: boolean;
  forceError: boolean;
};

type Listener = () => void;

let flags: DevFlags = { forceLoading: false, forceError: false };
const listeners = new Set<Listener>();

export function getDevFlags(): DevFlags {
  return flags;
}

export function setDevFlags(patch: Partial<DevFlags>) {
  flags = { ...flags, ...patch };
  listeners.forEach((listener) => listener());
}

export function subscribeDevFlags(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
