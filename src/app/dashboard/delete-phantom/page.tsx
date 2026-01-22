'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function WhopDeletePhantom() {
  const { toast } = useToast();
  const [sheetUrl, setSheetUrl] = useState('');
  const [confirmText, setConfirmText] = useState(''); 
  const [isDeleting, setIsDeleting] = useState(false);

  const isReadyToDelete = sheetUrl.trim() !== '' && confirmText === 'DELETE';

  const handleDelete = async () => {
    if (!isReadyToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch('/api/campaigns/google-sheet/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({ title: "Deleted", description: "Campaign removed successfully." });
        setSheetUrl('');
        setConfirmText('');
      } else {
        throw new Error(data.error || "Failed to delete");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-lg border p-4 bg-red-950/20 border-red-900/50">
      <div className="flex items-center gap-2 mb-2">
        <Trash2 className="h-5 w-5 text-red-500" />
        <h1 className="text-lg text-red-500 font-bold font-mono">DELETE_CAMPAIGN</h1>
      </div>
      
      <p className="text-[10px] text-red-400/70 mb-4 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        THIS ACTION REMOVES THE CAMPAIGN FROM THE ACTIVE CRON QUEUE.
      </p>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">
            Target Google Sheet URL
          </label>
          <Input 
            placeholder="https://docs.google.com/spreadsheets/d/..." 
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            className="bg-black/50 border-red-900/30 focus:border-red-500 text-sm"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">
            Type <span className="text-red-500 font-bold">DELETE</span> to confirm
          </label>
          <Input 
            placeholder="DELETE" 
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="bg-black/50 border-red-900/30 focus:border-red-500 text-sm font-bold tracking-widest"
          />
        </div>

        <Button 
          variant="destructive" 
          className={`w-full font-bold transition-all ${
            isReadyToDelete ? 'opacity-100' : 'opacity-30 grayscale'
          }`}
          onClick={handleDelete}
          disabled={!isReadyToDelete || isDeleting}
        >
          {isDeleting ? 'TERMINATING...' : 'EXECUTE DELETE'}
        </Button>
      </div>
    </div>
  );
}