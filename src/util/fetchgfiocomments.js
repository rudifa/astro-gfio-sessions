/* global fetch */

import fs from "fs";
import os from "os";
import path from "path";

/**
 * getGithubAccessToken - get the token string starting with ghp_ from ~/.netrc
 *
 * @returns {string} the token string
 */
export function getGithubAccessToken() {
  // Define the path to the .netrc file in the home directory.
  const netrcPath = path.join(os.homedir(), ".netrc");

  // Read the .netrc file synchronously.
  const netrc = fs.readFileSync(netrcPath, "utf8");

  // Split the file content into lines.
  const lines = netrc.split("\n");

  // Iterate over each line in the .netrc file.
  for (let line of lines) {
    // Trim leading and trailing whitespace from the line and split it into tokens.
    const tokens = line.trim().split(/\s+/);

    // Iterate over each token in the line.
    for (let i = 0; i < tokens.length; i++) {
      // If a token is "password", return the next token, which is assumed to be the GitHub access token.
      if (tokens[i] === "password") {
        return tokens[i + 1];
      }
    }
  }

  // If no GitHub access token is found, return null.
  return null;
}

/**
 * getGithubRepoData - get the repository data from GitHub
 *
 * This function fetches all issues and their comments from a GitHub repository using the GitHub GraphQL API.
 *
 * @param {*} owner
 * @param {*} token
 * @param {*} repo
 * @returns
 */
export async function fetchAllIssuesWithComments(owner, token, repo) {
  // Initialize an array to store the issues.
  let issues = [];
  // Initialize a variable to store the end cursor for pagination.
  let endCursor = null;

  // Use a while loop to continuously fetch issues until there are no more pages.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Define the GraphQL query. This query fetches the first 100 issues and their comments from the specified repository.
    // If an end cursor is provided, it fetches the issues after the issue at the end cursor.
    const query = `
            query {
                repository(owner:"${owner}", name:"${repo}") {
                    issues(first:100, after:${
                      endCursor ? `"${endCursor}"` : null
                    }) {
                        pageInfo {
                            endCursor
                            hasNextPage
                        }
                        nodes {
                            title
                            comments(first:100) {
                                nodes {
                                    body
                                }
                            }
                        }
                    }
                }
            }
        `;

    // Send a POST request to the GitHub GraphQL API with the query.
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    // Parse the JSON response.
    const data = await response.json();
    // Filter out issues with no comments.
    const issuesWithComments = data.data.repository.issues.nodes.filter(
      (issue) => issue.comments.nodes.length > 0,
    );
    // Add the issues with comments to the issues array.
    issues = issues.concat(issuesWithComments);

    // If there are no more pages, break the loop.
    if (!data.data.repository.issues.pageInfo.hasNextPage) {
      break;
    }

    // Update the end cursor with the end cursor from the response.
    endCursor = data.data.repository.issues.pageInfo.endCursor;

  }

  // Return the issues.
  return issues;
}
