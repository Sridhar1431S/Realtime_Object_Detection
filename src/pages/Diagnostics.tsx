import { useEffect, useState } from "react";

export default function DiagnosticsPage() {
  const [envVars, setEnvVars] = useState({
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "NOT SET",
    supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "NOT SET",
  });
  const [connectivity, setConnectivity] = useState({
    online: navigator.onLine,
    canReachSupabase: false,
    error: "",
  });

  useEffect(() => {
    // Test DNS resolution
    const testConnection = async () => {
      try {
        console.log("Testing Supabase connectivity...");
        const response = await fetch(
          `${envVars.supabaseUrl}/auth/v1/health`,
          { method: "GET" }
        );
        console.log("Health check response:", response);
        setConnectivity((prev) => ({
          ...prev,
          canReachSupabase: response.ok,
        }));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("Connectivity error:", errorMsg);
        setConnectivity((prev) => ({
          ...prev,
          error: errorMsg,
          canReachSupabase: false,
        }));
      }
    };

    testConnection();

    const handleOnline = () => setConnectivity((prev) => ({ ...prev, online: true }));
    const handleOffline = () => setConnectivity((prev) => ({ ...prev, online: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Diagnostics</h1>

        <div className="space-y-6">
          <div className="p-4 border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="space-y-2 font-mono text-sm">
              <div>
                <span className="text-muted-foreground">VITE_SUPABASE_URL:</span>
                <div className="break-all text-primary">{envVars.supabaseUrl}</div>
              </div>
              <div>
                <span className="text-muted-foreground">VITE_SUPABASE_KEY:</span>
                <div className="break-all text-primary">
                  {envVars.supabaseKey.substring(0, 20)}...
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Network Connectivity</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Internet Connection:</span>
                <span className={`ml-2 ${connectivity.online ? "text-green-500" : "text-red-500"}`}>
                  {connectivity.online ? "✓ Connected" : "✗ Offline"}
                </span>
              </div>
              <div>
                <span className="font-medium">Supabase Reachable:</span>
                <span className={`ml-2 ${connectivity.canReachSupabase ? "text-green-500" : "text-red-500"}`}>
                  {connectivity.canReachSupabase ? "✓ Yes" : "✗ No"}
                </span>
              </div>
              {connectivity.error && (
                <div className="text-red-500 mt-2">
                  <span className="font-medium">Error:</span> {connectivity.error}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border border-yellow-500/30 bg-yellow-500/5 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">⚠️ Troubleshooting</h2>
            <ul className="space-y-2 text-sm">
              <li>• Check if your internet connection is working</li>
              <li>• Restart the Vite dev server: Ctrl+C then <code className="bg-secondary px-1 rounded">npm run dev</code></li>
              <li>• Verify .env file has correct Supabase URL</li>
              <li>• Check if firewall is blocking supabase.co domain</li>
              <li>• Try in incognito/private mode to rule out browser cache issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
