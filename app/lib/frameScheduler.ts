// Keep high-frequency input responsive without rendering intermediate frames.
export function createFrameScheduler<T>(
  apply: (value: T) => void,
  requestFrame: (callback: FrameRequestCallback) => number,
  cancelFrame: (id: number) => void,
) {
  let frame: number | null = null;
  let pending: { value: T } | null = null;

  const flush = () => {
    if (frame !== null) cancelFrame(frame);
    frame = null;
    const next = pending;
    pending = null;
    if (next) apply(next.value);
  };

  return {
    schedule(value: T) {
      pending = { value };
      if (frame === null) frame = requestFrame(flush);
    },
    flush,
    cancel() {
      if (frame !== null) cancelFrame(frame);
      frame = null;
      pending = null;
    },
  };
}
