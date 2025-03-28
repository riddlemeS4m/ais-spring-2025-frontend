"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";

interface ConfirmActionProps {
  command: string;
  apiEndpoint: string;
  actionId: string;
  question: string;
  severity: string;
  userId: string;
  //   onComplete: (result: any) => void;
  // addToolResult: (result: any) => void;

  title?: string;
  yesText?: string;
  noText?: string;
  description?: string;
}
import { toast } from "sonner";
import { createJiraTicket } from "@/lib/actions";
import { JiraTicketInfo } from "./jira";
export function ConfirmAction({
  command,
  apiEndpoint,
  actionId,
  question,
  severity, 
  userId,
  //   onComplete,
  // addToolResult,
  title = "Confirm Action",
  yesText = "Yes",
  noText = "No",
  description = "This action is being recommended by an ML model based off of past issues of similar variety. Would you like to proceed with executing the following script?",
}: ConfirmActionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  console.log(params.id)
  const handleAction = async (confirmed: boolean) => {
    setIsLoading(true);
    if (confirmed) {
      try {
        const response = await fetch(
          apiEndpoint +
            "/" +
            "execute-action" +
            "/" +
            params.id +
            "/" +
            actionId,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        if (!response.ok) {
          // throw new Error(`Request failed with status ${response.status}`);
          toast.error(
            `Looks like something went wrong, here is the status code: ${response.status}`
          );
        }

        if (response.ok) {
          toast(
            "The command went through, give it a second to reflect in the pertinent issue"
          );
        }

        // Call the provided callback with the result
        //   onComplete(result);

        // Persist the result to the database
        //   addToolResult(result);
      } catch (error) {
        // console.error("Error processing action:", error);
        toast.error('Looks like something went wrong, contact your system administrator') 
      } finally {
        setIsLoading(false);
      }
    } else if (!confirmed) {
      try {
        // @ts-ignore
        await createJiraTicket(question, severity, userId )
        toast('Jira ticket created!')

      } catch (error) {
        toast.error('Looks like something went wrong with creating the ticket, contact your system administrator') 
      }finally {
        setIsLoading(false)
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>

        <p className="text-gray-700 dark:text-gray-300">If you click no, the system will create a jira ticket on your behalf with a description of your issue</p>
        <p className="text-gray-700 dark:text-gray-300">{description}</p>


        <div className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
          {command}
        </div>

        <div className="flex space-x-3 pt-2">
          <Button
suppressHydrationWarning 
            onClick={() => handleAction(true)}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? "Processing..." : yesText}
          </Button>

          <Button
          suppressHydrationWarning 
            onClick={() => handleAction(false)}
            disabled={isLoading}
            variant="outline"
            className="border-gray-300 dark:border-gray-600"
          >
            {noText}
          </Button>
        </div>
      </div>
    </div>
  );
}
