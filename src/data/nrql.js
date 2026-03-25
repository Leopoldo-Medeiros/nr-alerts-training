const nrqlSegments = [
  {
    id: 'sel',
    text: 'SELECT',
    className: 'seg seg-kw',
    label: 'SELECT clause',
    body: 'Every NRQL condition must start with SELECT. The result must be a single numeric value — the aggregation function (average, percentile, count, etc.) produces the number that is compared against your threshold.',
  },
  {
    id: 'agg',
    text: 'average(duration)',
    className: 'seg seg-fn',
    label: 'Aggregation function: average(duration)',
    body: '<strong>average(duration)</strong> computes the mean transaction duration across all transactions in the evaluation window. Other common functions: <code>percentile(duration, 95)</code>, <code>count(*)</code>, <code>rate(count(*), 1 minute)</code>, <code>uniqueCount(user)</code>.',
  },
  {
    id: 'from',
    text: 'FROM',
    className: 'seg seg-kw',
    label: 'FROM clause',
    body: "Specifies the event type to query. <strong>Transaction</strong> is New Relic's primary APM event. Other common sources: <code>TransactionError</code>, <code>Metric</code>, <code>Log</code>, <code>SystemSample</code>, <code>SyntheticCheck</code>.",
  },
  {
    id: 'evt',
    text: 'Transaction',
    className: 'seg seg-str',
    label: 'Event type: Transaction',
    body: 'The Transaction event type is populated by APM agents. Each web request, background job, or transaction segment produces a Transaction event with attributes like <code>duration</code>, <code>name</code>, <code>appName</code>, <code>error.rate</code>, and more.',
  },
  {
    id: 'where',
    text: 'WHERE',
    className: 'seg seg-kw',
    label: 'WHERE clause — scoping filter',
    body: 'Narrows the query to a specific subset of data. Without a WHERE clause, the condition evaluates across all data in the account for that event type. Always scope your conditions as narrowly as practical to reduce noise and improve signal clarity.',
  },
  {
    id: 'filter',
    text: "appName = 'Checkout Service'",
    className: 'seg seg-plain',
    label: "Filter: appName = 'Checkout Service'",
    body: "This restricts the condition to only transactions from the application named 'Checkout Service'. You can combine multiple filters: <code>appName = 'Checkout Service' AND environment = 'production'</code>. Use <code>IN</code> for multiple values: <code>appName IN ('Service A', 'Service B')</code>.",
  },
  {
    id: 'facet',
    text: 'FACET',
    className: 'seg seg-kw',
    label: 'FACET clause — per-entity evaluation',
    body: '<strong>Critical:</strong> FACET splits the query result by the specified attribute. The condition evaluates the threshold <em>independently per value</em>. With <code>FACET host</code>, each host that violates the threshold opens its own incident. 20 violating hosts = 20 incidents. Omit FACET if you want a single aggregated evaluation across all entities.',
  },
  {
    id: 'facetval',
    text: 'host',
    className: 'seg seg-str',
    label: 'FACET attribute: host',
    body: 'The attribute used to split evaluation. Common FACET choices: <code>host</code>, <code>appName</code>, <code>containerId</code>, <code>tags.environment</code>, <code>nr.entity.name</code>. The FACET value also becomes part of the incident title, making it easier to identify which entity is affected.',
  },
];

export default nrqlSegments;
