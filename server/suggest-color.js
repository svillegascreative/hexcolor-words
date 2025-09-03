require("dotenv").config();
const fetch = require("node-fetch");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Only POST requests allowed" }),
    };
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // e.g. "username/repo"
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) {
    throw new Error("Missing GITHUB_TOKEN or GITHUB_REPO environment variable");
  }

  const colorsPath = "_data/colors.json";
  const { hex, name, url } = JSON.parse(event.body);

  // Step 1: Get the current colors.json
  const getRes = await fetch(
    `https://api.github.com/repos/${repo}/contents/${colorsPath}`,
    {
      headers: { Authorization: `token ${token}` },
    }
  );
  if (!getRes.ok) {
    return { statusCode: getRes.status, body: await getRes.text() };
  }
  const fileData = await getRes.json();
  const content = Buffer.from(fileData.content, "base64").toString("utf8");
  let colors = JSON.parse(content);

  // Step 2: Add the new color in alphabetical order
  colors.push({ hex, name, url });
  colors.sort((a, b) => a.name.localeCompare(b.name));
  const newContent = Buffer.from(JSON.stringify(colors, null, 2)).toString(
    "base64"
  );

  // Step 3: Create a new branch
  const branchRes = await fetch(
    `https://api.github.com/repos/${repo}/git/refs/heads`,
    {
      headers: { Authorization: `token ${token}` },
    }
  );
  const branches = await branchRes.json();
  const mainBranch =
    branches.find((b) => b.ref.endsWith("/main")) || branches[0];
  const sha = mainBranch.object.sha;
  const branchName = `suggest-color-${Date.now()}`;
  await fetch(`https://api.github.com/repos/${repo}/git/refs`, {
    method: "POST",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha,
    }),
  });

  // Step 4: Update colors.json in the new branch
  await fetch(`https://api.github.com/repos/${repo}/contents/${colorsPath}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Suggest color: ${name}`,
      content: newContent,
      branch: branchName,
      sha: fileData.sha,
    }),
  });

  // Step 5: Create a pull request
  const prRes = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
    method: "POST",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `Suggest color: ${name}`,
      head: branchName,
      base: mainBranch.ref.replace("refs/heads/", ""),
      body: `
      **name:** ${name}\n
      **hex code:** ${hex}\n
      **dictionary link**: ${url}
      `,
    }),
  });
  const pr = await prRes.json();

  return {
    statusCode: 200,
    body: JSON.stringify({ pr_url: pr.html_url }),
  };
};
