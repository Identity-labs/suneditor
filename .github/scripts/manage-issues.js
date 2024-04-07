require("dotenv").config();
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function closeOldIssues() {
  try {
    const owner = "jihong88";
    const repo = "suneditor";
    const issues = await octokit.issues.listForRepo({
      owner,
      repo,
      state: "open",
    });

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    for (const issue of issues.data) {
      const lastUpdated = new Date(issue.updated_at);
      if (lastUpdated < oneMonthAgo) {
        const comment = {
          owner,
          repo,
          issue_number: issue.number,
          body:
            "Thank you for your engagement with the project.\n" +
            "Due to a lack of activity for over a month, this issue has been automatically closed." +
            "\nThis is part of the process to keep the project up-to-date.\n\n" +
            "If a new version has been released recently, please test your scenario with that version to see if the issue persists.\n" +
            "If the problem still exists or if you believe this issue is still relevant, \n" +
            "feel free to reopen it and provide additional comments.\n\n" +
            "I truly appreciate your continuous interest and support for the project. Your feedback is crucial in improving its quality.",
        };
        await octokit.issues.createComment(comment);

        await octokit.issues.update({
          owner,
          repo,
          issue_number: issue.number,
          state: "closed",
        });
      }
    }
  } catch (error) {
    console.error(`Error while closing issues: ${error}`);
  }
}

closeOldIssues();