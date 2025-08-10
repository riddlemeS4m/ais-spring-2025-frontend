interface JiraTicketResponse {
  id: string;
  jiraTicketId: string;
  userQuery: string;
  severity: string;
  createdAt: string;
  assignedTo: string | null;
  escalationTime: string | null;
  resolved: boolean;
  userId: string;
}

interface JiraTicketInfoProps {
  ticket: JiraTicketResponse;
}

export function JiraTicketInfo({ ticket }: JiraTicketInfoProps) {
  // Format the date to be more readable
  const formattedDate = new Date(ticket.createdAt).toLocaleString();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Ticket {ticket.jiraTicketId}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              ticket.resolved
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
            }`}
          >
            {ticket.resolved ? "Resolved" : "Open"}
          </span>
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Issue:
            </span>
            <p className="text-gray-900 dark:text-gray-100">
              {ticket.userQuery}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Severity:
              </span>
              <p className="text-gray-900 dark:text-gray-100">
                {ticket.severity}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Created:
              </span>
              <p className="text-gray-900 dark:text-gray-100">
                {formattedDate}
              </p>
            </div>
          </div>

          {ticket.assignedTo && (
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Assigned To:
              </span>
              <p className="text-gray-900 dark:text-gray-100">
                {ticket.assignedTo}
              </p>
            </div>
          )}

          {ticket.escalationTime && (
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Escalation Time:
              </span>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(ticket.escalationTime).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
