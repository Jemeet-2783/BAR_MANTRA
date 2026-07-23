/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ErrorAlertPayload {
  source: 'public_form' | 'admin_panel' | 'api_backend';
  action: string;
  error: string;
  context?: Record<string, any>;
  timestamp: string;
}

/**
 * Actionable Error Monitoring & Telemetry Reporter
 * Logs structured alerts and integrates with external monitoring sinks (e.g. Sentry, Webhooks)
 */
export function reportErrorAlert(payload: Omit<ErrorAlertPayload, 'timestamp'>) {
  const alert: ErrorAlertPayload = {
    ...payload,
    timestamp: new Date().toISOString(),
  };

  // Structured console telemetry for observability
  console.error('[BARMANTRA MONITORING ALERT]', JSON.stringify(alert, null, 2));

  // If Sentry or external Webhook exists in environment window, send payload
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureException(new Error(alert.error), {
      extra: {
        source: alert.source,
        action: alert.action,
        context: alert.context,
      },
    });
  }

  // Trigger alert dispatch event for client UI diagnostics if available
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('barmantra:error_alert', { detail: alert }));
  }

  return alert;
}
