export async function createJiraTicket(question: string, severity: string, userId: string ){
  'use client'
    const response = await fetch(
        // `${process.env.PYTHON_BASE_URL}/jira/ticket`,
        `https://aisapi.andrewbhudson.dev/jira/ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userQuery: question,
            userId: userId,
            severity: severity,
          }),
        }
      ); 
}