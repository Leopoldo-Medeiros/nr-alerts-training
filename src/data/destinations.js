const destinations = [
  {
    name: 'Slack',
    auth: 'OAuth2 or Webhook URL',
    detail: 'Send formatted messages to any Slack channel or DM. Supports Handlebars message templates. The webhook URL approach requires no OAuth — just paste a Slack incoming webhook URL. OAuth allows more dynamic channel routing.',
    common: 'Token expiry or revoking the Slack app integration without updating the destination.',
    iconType: 'slack',
  },
  {
    name: 'PagerDuty',
    auth: 'Integration key (API v2 or Events API)',
    detail: 'Creates and resolves PagerDuty incidents automatically. Use the Events API v2 key for modern integrations. Issue Created maps to PagerDuty trigger, Issue Resolved maps to resolve. Priority can be mapped to PagerDuty urgency.',
    common: 'Using a deprecated v1 key, or missing the "resolve" trigger in the workflow configuration so PagerDuty incidents never auto-resolve.',
    iconType: 'pagerduty',
  },
  {
    name: 'Jira',
    auth: 'Jira API token + account email',
    detail: 'Creates Jira issues automatically when alert conditions fire. Configure the project key, issue type, priority mapping, and field mappings. Useful for teams that use Jira as their incident tracker.',
    common: 'API token generated for the wrong account, or field configuration that conflicts with required Jira fields on the project.',
    iconType: 'jira',
  },
  {
    name: 'ServiceNow',
    auth: 'OAuth2 or basic auth (instance URL + credentials)',
    detail: 'Creates ServiceNow incidents or change requests. Maps NR issue priority to ServiceNow impact/urgency. Supports bidirectional sync so ServiceNow state changes can update the NR issue.',
    common: 'SSL certificate issues on private ServiceNow instances, or CORS/network restrictions blocking the outbound webhook from New Relic.',
    iconType: 'servicenow',
  },
  {
    name: 'Webhook',
    auth: 'URL + optional auth header',
    detail: "Generic HTTP POST to any endpoint. Full control over payload format via Handlebars template. Supports custom headers for authentication. Use this for any system not natively supported: OpsGenie, custom internal tools, runbook automation triggers.",
    common: "Endpoint behind a firewall that blocks New Relic's outbound IPs, or JSON template syntax errors in the message body.",
    iconType: 'webhook',
  },
  {
    name: 'Email',
    auth: 'None (send to any email address)',
    detail: 'Sends formatted email notifications. No authentication required — specify recipient email addresses. Good for non-technical stakeholders or management escalation paths. Less reliable than webhook-based destinations for high-volume alerting.',
    common: 'Landing in spam filters. No authentication or per-address management means no fine-grained control.',
    iconType: 'email',
  },
  {
    name: 'AWS EventBridge',
    auth: 'AWS account ID + partner event source',
    detail: 'Publishes NR alert events into an AWS EventBridge event bus. Use this to trigger Lambda functions, Step Functions, or other AWS automation in response to alert conditions. Good for self-healing automation.',
    common: 'Resource-based policy on the event bus not granting New Relic permission to publish events.',
    iconType: 'aws',
  },
  {
    name: 'xMatters',
    auth: 'xMatters inbound integration URL',
    detail: 'Routes alerts to xMatters for on-call scheduling and escalation management. Use the inbound integration URL from an xMatters workflow. Supports on-call rotation aware delivery — alerts go to whoever is on-call at the time.',
    common: 'Inbound integration URL changes when the xMatters workflow is republished, breaking the New Relic destination.',
    iconType: 'xmatters',
  },
];

export default destinations;
