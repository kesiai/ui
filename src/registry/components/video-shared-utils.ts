import { useEffect, useState } from 'react';

export interface TableConfig {
  id: string;
  name: string;
  [key: string]: any;
}

/**
 * Hook to manage video configuration based on a data table.
 * 
 * @param table The selected data table configuration.
 * @param defaultUrl The static URL provided in props.
 * @returns { videoUrl, loading, error }
 */
export const useVideoTableConfig = (table: TableConfig | undefined | null, defaultUrl: string | undefined) => {
  const [videoUrl, setVideoUrl] = useState(defaultUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no table is selected, use the default static URL
    if (!table || !table.id) {
      setVideoUrl(defaultUrl);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchConfig = async () => {
      try {
        // NOTE: This logic simulates the requirement: "call interface based on data table, return interface address".
        // Since the reference implementation (workspace-v4) is not accessible, 
        // this is a placeholder for the actual API call.
        // You should implement the actual fetch logic here.
        
        // Example:
        // const res = await fetch(`/api/video/get_config?tableId=${table.id}`);
        // const data = await res.json();
        // if (isMounted) setVideoUrl(data.url);

        console.log(`[VideoTableConfig] Fetching config for table: ${table.id}`);
        
        // Placeholder: currently just falls back to defaultUrl or you could mock a response
        if (isMounted) {
            // For now, we assume the table might map to a URL, but without the backend, 
            // we keep the defaultUrl or set it to empty if specific logic requires it.
            setVideoUrl(defaultUrl); 
        }

      } catch (err) {
        console.error("Failed to fetch video table config:", err);
        if (isMounted) setError("Failed to load configuration");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchConfig();

    return () => {
      isMounted = false;
    };
  }, [table, defaultUrl]);

  return { videoUrl, loading, error };
};
