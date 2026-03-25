export const workflowIssues = [
  { name: 'Checkout Service — High Latency',  priority: 'CRITICAL', env: 'production', team: 'payments', dotVariant: 'crit' },
  { name: 'Auth Service — Error Spike',       priority: 'CRITICAL', env: 'production', team: 'platform', dotVariant: 'crit' },
  { name: 'Worker Queue — Backlog Growing',   priority: 'WARNING',  env: 'production', team: 'platform', dotVariant: 'warn' },
  { name: 'Staging DB — Slow Queries',        priority: 'CRITICAL', env: 'staging',    team: 'platform', dotVariant: 'crit' },
  { name: 'CDN Edge — High Miss Rate',        priority: 'WARNING',  env: 'production', team: 'infra',    dotVariant: 'warn' },
];

export const workflowFilters = [
  {
    id: 'all',
    label: 'No filter (all issues)',
    filterLabel: '-- no filter (all issues match) --',
    fn: () => true,
  },
  {
    id: 'crit',
    label: "priority = CRITICAL",
    filterLabel: "priority = 'CRITICAL'",
    fn: (i) => i.priority === 'CRITICAL',
  },
  {
    id: 'prod',
    label: "tags.environment = production",
    filterLabel: "tags.environment = 'production'",
    fn: (i) => i.env === 'production',
  },
  {
    id: 'team',
    label: "tags.team = platform",
    filterLabel: "tags.team = 'platform'",
    fn: (i) => i.team === 'platform',
  },
  {
    id: 'crit-prod',
    label: "priority = CRITICAL AND tags.environment = production",
    filterLabel: "priority = 'CRITICAL' AND tags.environment = 'production'",
    fn: (i) => i.priority === 'CRITICAL' && i.env === 'production',
  },
];
