#! node

// Collect options if any

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .usage('This script fetches issues from the gfio sessions github repo and prints them to stdout, in JSON format.')
  .option('c', {
    alias: 'commented',
    description: 'Fetch only commented issues',
    type: 'boolean',
  })
  .option('r', {
    alias: 'reversed',
    description: 'Reverse the order of issues',
    type: 'boolean',
  })
  .option('o', {
    alias: 'output',
    description: 'Define output file',
    type: 'string',
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

if (argv.reversed) {
  issues.reverse();
}

import { writeFile } from 'fs/promises';

const issuesJSON = JSON.stringify(issues, null, 2);

if (argv.output) {
  try {
    await writeFile(argv.output, issuesJSON);
    console.log(`Successfully wrote to ${argv.output}`);
  } catch (error) {
    console.error(`Failed to write to ${argv.output}: ${error}`);
  }
} else {
  console.log(issuesJSON);
}

console.error(
  `${issues.length} issues fetched from gfio sessions repo (${issuesJSON.length}) bytes`,
);
