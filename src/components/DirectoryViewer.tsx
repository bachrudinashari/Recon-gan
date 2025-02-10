
import { useState, useEffect } from "react";
import { Folder, ChevronRight, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DirectoryViewerProps {
  onLogout: () => void;
}

export const DirectoryViewer = ({ onLogout }: DirectoryViewerProps) => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDirectory = async (path: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://38.242.149.132/api/directory?path=${path}`);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch directory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory(currentPath.join('/'));
  }, [currentPath]);

  const navigateToPath = (path: string) => {
    setCurrentPath([...currentPath, path]);
  };

  const navigateBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Reconnaissance Results</h1>
          <Button variant="outline" onClick={onLogout}>
            Sign Out
          </Button>
        </div>

        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            {currentPath.length > 0 && (
              <Button variant="ghost" size="sm" onClick={navigateBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex items-center">
              {currentPath.map((part, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />}
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
                    key={item}
                    className="directory-item p-4 cursor-pointer hover:bg-accent"
                    onClick={() => navigateToPath(item)}
                  >
                    <div className="flex items-center space-x-3">
                      <Folder className="w-5 h-5 text-primary" />
                      <span className="font-mono text-sm truncate">{item}</span>
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
