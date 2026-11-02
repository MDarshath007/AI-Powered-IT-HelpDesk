export default function TicketPriorityBadge({ priority }) {
  const normalized = (priority || '').toLowerCase();

  let label = priority;
  let key = 'Medium';

  if (normalized === 'low') {
    label = 'Low';
    key = 'Low';
  } else if (normalized === 'medium') {
    label = 'Medium';
    key = 'Medium';
  } else if (normalized === 'high') {
    label = 'High';
    key = 'High';
  }

  const styles = {
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
    Medium: 'bg-amber-50 text-amber-800 border-amber-200',
    High: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const currentStyle = styles[key] || styles.Medium;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${currentStyle}`}
    >
      {label}
    </span>
  );
}
