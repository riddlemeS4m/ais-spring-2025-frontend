interface SystemInfo {
  h: string; // hostname
  k: string; // kernel
  c: number; // CPU cores
  t: number; // threads
  m: string; // CPU model
  u: number; // uptime in seconds
  cpu: number; // CPU usage
  mp: number; // memory usage
  dp: number; // disk usage
  b: number; // boot time
  v: string; // version
}

interface SystemData {
  id: string;
  host: string;
  name: string;
  port: string;
  status: string;
  created: string;
  updated: string;
  users: string[];
  info: SystemInfo;
}

interface SystemInfoCardProps {
  system: SystemData;
}

export function SystemInfoCard({ system }: SystemInfoCardProps) {
  // Add debugging logs
  console.log("SystemInfoCard rendered with:", { system });

  // More thorough null check
  if (!system) {
    console.log("System is null or undefined");
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          System information not available
        </p>
      </div>
    );
  }

  // Separate check for system.info
  if (!system.info) {
    console.log("System.info is null or undefined");
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          System details not available
        </p>
      </div>
    );
  }

  // Make sure system.status exists before checking it
  const isSystemUp =
    typeof system.status === "string" && system.status.toLowerCase() === "up";

  // Convert uptime from seconds to readable format
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="space-y-4">
        {/* Header with Status */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {system.name || "Unknown"} ({system.host || "Unknown"})
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              isSystemUp
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
            }`}
          >
            {system.status || "Unknown"}
          </span>
        </div>

        {/* System Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Hostname:
              </span>
              <p className="text-gray-900 dark:text-gray-100">
                {system.info.h || "Unknown"}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Port:
              </span>
              <p className="text-gray-900 dark:text-gray-100">
                {system.port || "Unknown"}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Kernel:
              </span>
              <p className="text-gray-900 dark:text-gray-100">
                {system.info.k || "Unknown"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                CPU Model:
              </span>
              <p className="text-gray-900 dark:text-gray-100">
                {system.info.m || "Unknown"}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                CPU Cores/Threads:
              </span>
              <p className="text-gray-900 dark:text-gray-100">
                {`${system.info.c || 0}/${system.info.t || 0}`}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Version:
              </span>
              <p className="text-gray-900 dark:text-gray-100">
                {system.info.v || "Unknown"}
              </p>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            System Usage
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                CPU
              </span>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${system.info.cpu || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {(system.info.cpu || 0).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Memory
              </span>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${system.info.mp || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {(system.info.mp || 0).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Disk
              </span>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${system.info.dp || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {(system.info.dp || 0).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Uptime: </span>
              <span className="text-gray-900 dark:text-gray-100">
                {formatUptime(system.info.u || 0)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Last Updated:{" "}
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {new Date(system.updated || Date.now()).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
