/**
 *
 * Title: Environments
 * Description: Environments setup
 * Author: Anik Hossain
 * Date: 7/14/2021
 *
 */

// Mudule Scaffolding
const environments = {};

environments.development = {
    envName: 'development',
    port: 3000,
    secretKey: 'kjfddeijfdksjfdjsfkjfjdksfj',
    maxChecks: 5,
};

environments.production = {
    envName: 'production',
    port: 4000,
    secretKey: 'akljfdajsfkjadsfdlksdjffds',
    maxChecks: 5,
};

// Get which env was passed
const currentEnv =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'string';

// Export corresponding environment object
const envToExoport =
    typeof environments[currentEnv] === 'object'
        ? environments[currentEnv]
        : environments.development;

module.exports = envToExoport;
