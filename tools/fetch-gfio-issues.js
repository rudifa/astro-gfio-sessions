#! node

// Collect options if any

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .usage('This script fetches issues from the gfio sessions github repo, in JSON format')
  .option('c', {
    alias: 'commented',
    description: 'Fetch only commented issues',
    type: 'boolean',
  })
  .help('h')
  .alias('h', 'help')
  .demandCommand(0, 0) // No positional arguments should be provided.
  .strict() // Only the defined options are allowed.
  .argv;

if (argv.commented) {
  console.error("Fetching only commented issues...");
} else {
  console.error('Fetching all issues...');
}

// Fetch gfio issues from the GitHub GraphQL API
// calling util/fetchgfiocomments.js functions

// Import functionsfrom the fetchgfiocomments module
import { fetchAllIssues, fetchAllIssuesWithComments, getGithubAccessToken } from "../src/util/fetchgfiocomments.js";

// Define the owner, token, and repo variables
const owner = "gongfudev";
const repo = "sessions";
const token = getGithubAccessToken();

var issues = [];

if (argv.commented) {
  issues = await fetchAllIssuesWithComments(owner, token, repo);
} else {
  issues = await fetchAllIssues(owner, token, repo);
}

// Log the issues to the console
const issuesJSON = JSON.stringify(issues, null, 2);
console.log(issuesJSON);
console.error(
  `${issues.length} issues fetched from gfio sessions repo (${issuesJSON.length}) bytes`,
);
