/**
 * Pure, framework-free calculation / equation functions. These are the
 * authoritative implementations of Floreat's business math: the backend calls
 * them on write from validated inputs; the frontend may reuse them for live
 * preview only (never trusted by the server).
 */
export * from './roof.calc.js'
