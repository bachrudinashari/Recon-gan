
import { useState, useEffect } from "react";
import { Folder, ChevronRight, ArrowLeft, File } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DirectoryItem {
  name: string;
  type: 'directory' | 'file';
  mtime?: string;
}

export const DirectoryViewer = () => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDirectory = async (path: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/Recon/${path}`);
      if (!response.ok) {
        throw new Error('Failed to fetch directory');
      }
      const data = await response.json();
      
      // Transform the API response into our DirectoryItem format
      const transformedItems = Object.entries(data).map(([name, details]: [string, any]) => ({
        name,
        type: details === 'directory' ? 'directory' : 'file',
        mtime: details.mtime || undefined
      }));
      
      setItems(transformedItems);
      console.log('Fetched items:', transformedItems); // Debug log
    } catch (error) {
      console.error('Failed to fetch directory:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory(currentPath.join('/'));
  }, [currentPath]);

  const navigateToPath = (item: DirectoryItem) => {
    if (item.type === 'directory') {
      setCurrentPath([...currentPath, item.name]);
    }
  };

  const navigateBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Reconnaissance Results</h1>

        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            {currentPath.length > 0 && (
              <Button variant="ghost" size="sm" onClick={navigateBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex items-center">
              <span className="text-sm font-mono text-muted-foreground">
                /Recon/
              </span>
              {currentPath.map((part, index) => (
                <div key={index} className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                  <span className="text-sm font-mono">{part}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          <ScrollArea className="h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
              {loading ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : items.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No items found in this directory
                </div>
              ) : (
                items.map((item) => (
                  <Card
                    key={item.name}
                    className={`directory-item p-4 cursor-pointer hover:bg-accent transition-all duration-200 ${
                      item.type === 'directory' ? 'hover:scale-[1.02]' : ''
                    }`}
                    onClick={() => navigateToPath(item)}
                  >
                    <div className="flex items-center space-x-3">
                      {item.type === 'directory' ? (
                        <Folder className="w-5 h-5 text-primary" />
                      ) : (
                        <File className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm truncate">{item.name}</p>
                        {item.mtime && (
                          <p className="text-xs text-muted-foreground truncate">
                            {new Date(item.mtime).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};
