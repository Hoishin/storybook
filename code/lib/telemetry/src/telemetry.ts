/// <reference types="node" />

import originalFetch from 'node-fetch';
import retry from 'fetch-retry';
import { nanoid } from 'nanoid';
import type { Options, TelemetryData } from './types';
import { getAnonymousProjectId } from './anonymous-id';
import { set as saveToCache } from './event-cache';
import { getSessionId } from './session-id';

const URL = process.env.STORYBOOK_TELEMETRY_URL || 'https://storybook.js.org/event-log';

const fetch = retry(originalFetch as any);

let tasks: Promise<any>[] = [];

export const addToGlobalContext = (key: string, value: any) => {
  globalContext[key] = value;
};

// context info sent with all events, provided
// by the app. currently:
// - cliVersion
const globalContext = {
  inCI: Boolean(process.env.CI),
  isTTY: process.stdout.isTTY,
} as Record<string, any>;

const prepareRequest = async (data: TelemetryData, context: Record<string, any>, options: any) => {
  const { eventType, payload, metadata, ...rest } = data;
  const sessionId = await getSessionId();
  const eventId = nanoid();
  const body = { ...rest, eventType, eventId, sessionId, metadata, payload, context };

  return fetch(URL, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    retries: 3,
    retryOn: [503, 504],
    retryDelay: (attempt: number) =>
      2 ** attempt *
      (typeof options?.retryDelay === 'number' && !Number.isNaN(options?.retryDelay)
        ? options.retryDelay
        : 1000),
  });
};

export async function sendTelemetry(
  data: TelemetryData,
  options: Partial<Options> = { retryDelay: 1000, immediate: false }
) {
  const { eventType, payload, metadata, ...rest } = data;

  // We use this id so we can de-dupe events that arrive at the index multiple times due to the
  // use of retries. There are situations in which the request "5xx"s (or times-out), but
  // the server actually gets the request and stores it anyway.

  // flatten the data before we send it

  const context = options.stripMetadata
    ? globalContext
    : {
        ...globalContext,
        anonymousId: getAnonymousProjectId(),
      };

  let request: any;
  try {
    request = prepareRequest(data, context, options);
    tasks.push(request);
    if (options.immediate) {
      await Promise.all(tasks);
    } else {
      await request;
    }

    const sessionId = await getSessionId();
    const eventId = nanoid();
    const body = { ...rest, eventType, eventId, sessionId, metadata, payload, context };

    await saveToCache(eventType, body);
  } catch (err) {
    //
  } finally {
    tasks = tasks.filter((task) => task !== request);
  }
}
