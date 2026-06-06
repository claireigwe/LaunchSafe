export function buildEmailHtml(title: string, bodyHtml: string, actionUrl?: string, actionLabel?: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
        <tr><td style="padding:32px 32px 0" align="center">
          <span style="font-size:20px;color:#2563eb;font-weight:700">⬡ LaunchSafe</span>
        </td></tr>
        <tr><td style="padding:24px 32px">
          <h2 style="margin:0 0 8px;font-size:20px;color:#1a1a1a;font-weight:600">${title}</h2>
          ${bodyHtml}
        </td></tr>
        ${actionUrl && actionLabel ? `
        <tr><td style="padding:0 32px 24px" align="center">
          <a href="${actionUrl}" style="display:inline-block;padding:12px 24px;border-radius:8px;background:#2563eb;color:#ffffff;text-decoration:none;font-size:14px;font-weight:500">${actionLabel}</a>
        </td></tr>` : ''}
        <tr><td style="padding:16px 32px;border-top:1px solid #eee">
          <p style="margin:0;font-size:12px;color:#888">You received this email because you have a LaunchSafe account. <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://launchsafe.app'}/settings" style="color:#2563eb;text-decoration:none">Notification preferences</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function taskCreatedHtml(taskTitle: string, dueDate: string | null): string {
  const due = dueDate ? `<p style="margin:8px 0 0;font-size:14px;color:#666">Due: ${dueDate}</p>` : '';
  return `<p style="margin:0 0 16px;font-size:14px;color:#444;line-height:1.6">A new compliance task has been created:</p>
    <div style="padding:16px;background:#f8f9ff;border-radius:8px;margin-bottom:16px">
      <p style="margin:0;font-size:15px;color:#1a1a1a;font-weight:500">${taskTitle}</p>${due}
    </div>`;
}

export function taskCompletedHtml(title: string): string {
  return `<p style="margin:0;font-size:14px;color:#444;line-height:1.6">${title} has been marked as complete. Great progress on your compliance journey.</p>`;
}

export function taskOverdueHtml(title: string): string {
  return `<p style="margin:0;font-size:14px;color:#444;line-height:1.6">The following compliance task is overdue and requires immediate attention:</p>
    <div style="padding:16px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;margin:12px 0">
      <p style="margin:0;font-size:15px;color:#dc2626;font-weight:500">${title}</p>
    </div>`;
}

export function deadlineApproachingHtml(taskTitle: string, days: number): string {
  return `<p style="margin:0;font-size:14px;color:#444;line-height:1.6">${taskTitle} is due in ${days} day${days > 1 ? 's' : ''}. Make sure to complete it before the deadline.</p>`;
}

export function documentUploadedHtml(docTitle: string): string {
  return `<p style="margin:0;font-size:14px;color:#444;line-height:1.6">${docTitle} has been uploaded successfully to your compliance document library.</p>`;
}

export function subscriptionActivatedHtml(planName: string): string {
  return `<p style="margin:0;font-size:14px;color:#444;line-height:1.6">Your <strong>${planName}</strong> plan is now active. Welcome to Compliance Autopilot.</p>
    <p style="margin:8px 0 0;font-size:14px;color:#444;line-height:1.6">You now have access to compliance dashboards, task management, document storage, and regulatory monitoring.</p>`;
}

export function subscriptionRenewedHtml(planName: string): string {
  return `<p style="margin:0;font-size:14px;color:#444;line-height:1.6">Your <strong>${planName}</strong> plan has been renewed successfully. Your compliance coverage continues uninterrupted.</p>`;
}

export function paymentFailedHtml(): string {
  return `<p style="margin:0;font-size:14px;color:#444;line-height:1.6">Your recent payment could not be processed. Please update your payment method to avoid service interruption.</p>`;
}

export function welcomeHtml(): string {
  return `<p style="margin:0;font-size:14px;color:#444;line-height:1.6">Welcome to LaunchSafe. Your compliance workspace is ready.</p>
    <p style="margin:8px 0 0;font-size:14px;color:#444;line-height:1.6">Start by adding your first compliance task or uploading your business documents.</p>`;
}
