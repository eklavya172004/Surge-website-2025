import test from "node:test";
import assert from "node:assert/strict";
import { createFrameScheduler } from "../app/lib/frameScheduler.ts";

function harness() {
  const callbacks = new Map();
  const applied = [];
  let nextId = 0;
  const scheduler = createFrameScheduler((value) => applied.push(value), (callback) => {
    callbacks.set(++nextId, callback);
    return nextId;
  }, (id) => callbacks.delete(id));
  return { scheduler, applied, callbacks, tick() { [...callbacks.values()].forEach((callback) => callback(0)); } };
}

test("a burst of pointer updates renders only its latest camera position per frame", () => {
  const { scheduler, applied, callbacks, tick } = harness();
  for (let i = 0; i < 100; i++) scheduler.schedule({ center: [i, i], zoom: 2 });
  assert.equal(callbacks.size, 1);
  assert.deepEqual(applied, []);
  tick();
  assert.deepEqual(applied, [{ center: [99, 99], zoom: 2 }]);
  scheduler.schedule({ center: [120, 120], zoom: 3 });
  tick();
  assert.equal(applied.length, 2);
  assert.equal(applied[1].zoom, 3);
});

test("ending a gesture flushes its final position exactly once", () => {
  const { scheduler, applied, callbacks, tick } = harness();
  scheduler.schedule("final position");
  scheduler.flush();
  assert.deepEqual(applied, ["final position"]);
  assert.equal(callbacks.size, 0);
  tick();
  assert.equal(applied.length, 1);
});

test("reset, selection and unmount can cancel a stale pending gesture", () => {
  const { scheduler, applied, callbacks, tick } = harness();
  scheduler.schedule("old camera");
  scheduler.cancel();
  assert.equal(callbacks.size, 0);
  tick();
  assert.deepEqual(applied, []);
  scheduler.schedule("new camera");
  tick();
  assert.deepEqual(applied, ["new camera"]);
});
