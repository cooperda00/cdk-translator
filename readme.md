# Translation App

## TODOs 
- TODO :
- react-query
- modalled window of previous translations
- Rate limiting / max requests

`
// Create a usage plan with a quota based on Cognito user
const usagePlan = api.addUsagePlan('MyUsagePlan', {
    name: 'My Usage Plan',
    quota: {
    limit: 100,
    period: apigateway.QuotaPeriod.DAY,
    },
    throttle: {
    rateLimit: 10,
    burstLimit: 2,
    },
});

// Add the Cognito user pool client to the usage plan
usagePlan.addApiKey(userPoolClient.defaultApiKey!);
    `