"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useParams } from 'next/navigation'

interface ConfirmActionProps {
    command: string;
  apiEndpoint: string;
  actionId: string;
//   onComplete: (result: any) => void;
  // addToolResult: (result: any) => void;
  title?: string;
  yesText?: string;
  noText?: string;
  description?: string;
}
import { toast } from 'sonner';
    export function ConfirmAction({
        command,
  apiEndpoint,
  actionId,
//   onComplete,
  // addToolResult,
  title = "Confirm Action",
  yesText = "Yes",
  noText = "No",
  description = "This action is being recommended by an ML model based off of past issues of similar variety. Would you like to proceed with executing the following script?",
}: ConfirmActionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams()



  const handleAction = async (confirmed: boolean) => {
    setIsLoading(true);
    try {
      console.log(apiEndpoint)
      const response = await fetch(apiEndpoint + "/" + "execute-action" + "/" + params.id + "/" + actionId , {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      
      const result = await response.json();
      if (!response.ok) {
        // throw new Error(`Request failed with status ${response.status}`);
        toast.error(`Looks like something went wrong, here is the status code: ${response.status}`)
        } 
       
       if(response.ok) {
        toast('The command went through, give it a second to reflect in the pertinent issue')
       }
        
        console.log(result)

      // Call the provided callback with the result
    //   onComplete(result);

      // Persist the result to the database
    //   addToolResult(result);

    } catch (error) {
      console.error("Error processing action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>

        <p className="text-gray-700 dark:text-gray-300">{description}</p>

        <div className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
          {command}
        </div>

        <div className="flex space-x-3 pt-2">
          <Button
            onClick={() => handleAction(true)}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? "Processing..." : yesText}
          </Button>

          <Button
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
