"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderIcon } from "@/components/icons";
import { toast } from "sonner";
import Link from "next/link";
import { HomeIcon, SearchIcon } from "lucide-react";
import { desc } from "drizzle-orm";

interface Task {
  id: string;
  name: string;
  description: string;
  url: string;
  script: string;
  port: number | null;
  method: string | null;
  headers: Record<string, string> | null;
  payload: any | null;
  interval: number;
  next_run: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({
    name: "",
    description: "",
    url: "",
    script: "",
    interval: 3600,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("https://aisapi.andrewbhudson.dev/actions");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNextRun = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff < 0) return "Past due";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    return `in ${minutes}m`;
  };

  const formatInterval = (ms: number) => {
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.script.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://aisapi.andrewbhudson.dev/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id: editingId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save task");
      }

      // Reset form and refresh tasks
      setFormData({
        name: "",
        description: "",
        url: "",
        script: "",
        interval: 3600,
      });
      setEditingId(null);
      await fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunAction = async (actionId: string, name: string, description: string, script: string, url: string, interval: number) => {
    try {
      const response = await fetch(
        `https://aisapi.andrewbhudson.dev/schedule-task/${actionId}`,
        {
            body: JSON.stringify({
                    "name": name,
                    "description": description,
                    "url": url,
                    "script":script,
                    "interval":interval,
                  
            }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
      toast.error('Looks like something went wrong, contact your system administrator')
      }else if(response.ok){
          toast('Scheduled successfully!')
      }

      // Refresh the tasks list to get updated next_run time
      await fetchTasks();
    } catch (error) {
      console.error("Error executing action:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <HomeIcon size={16} />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 ml-4">
          Task Management
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[calc(100vh-12rem)] flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Current Tasks
            </h2>
            <div className="relative">
              <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 pr-2 space-y-4">
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {task.name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {task.interval && (
                          <>Runs every {task.interval} seconds</>
                        )}
                      </span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300">
                      {task.description}
                    </p>

                    <div className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                      {task.script}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-500 dark:text-gray-400">
                        Server: {task.url}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {task.next_run && (
                          <>Next run: {formatNextRun(task.next_run)}</>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        onClick={() => handleRunAction(task.id, task.name, task.description, task.script, task.url, task.interval)}
                        size="sm"
                        className={`bg-blue-600 hover:bg-blue-700 text-white ${
                          !task.interval ? "invisible" : "visible"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          Schedule now
                        </span>
                      </Button>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingId(task.id);
                            setFormData({
                              name: task.name,
                              description: task.description,
                              url: task.url,
                              script: task.script,
                              interval: task.interval,
                            });
                          }}
                          variant="outline"
                          size="sm"
                          className="border-gray-300 dark:border-gray-600"
                        >
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredTasks.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No tasks found matching your search.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {editingId ? "Edit Action" : "Create New Action"}
            </h2>

            <div className="overflow-y-auto h-[calc(100%-3rem)]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                      placeholder="Task name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      URL
                    </label>
                    <input
                      type="text"
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                      placeholder="Server URL"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                    rows={2}
                    placeholder="Task description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Script
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.script}
                      onChange={(e) =>
                        setFormData({ ...formData, script: e.target.value })
                      }
                      className="w-full font-mono text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600"
                      rows={3}
                      placeholder="Enter script command"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Interval
                  </label>
                  <select
                    value={formData.interval}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        interval: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                  >
                    <option value={3600000}>1 hour</option>
                    <option value={86400000}>1 day</option>
                    <option value={604800000}>1 week</option>
                    <option value={2592000000}>1 month</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        {editingId ? "Updating..." : "Creating..."}
                      </span>
                    ) : editingId ? (
                      "Update Task"
                    ) : (
                      "Create Task"
                    )}
                  </Button>

                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => {
                        setEditingId(null);
                        setFormData({
                          name: "",
                          description: "",
                          url: "",
                          script: "",
                          interval: 3600,
                        });
                      }}
                      className="border-gray-300 dark:border-gray-600"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
