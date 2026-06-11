import { useState, useEffect, useCallback } from 'react';
import { PlatedEntry, NewEntryInput } from '@/lib/types';
import * as DB from '@/lib/database';

export function useEntries() {
  const [entries, setEntries] = useState<PlatedEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await DB.getAllEntries();
    setEntries(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addEntry(input: NewEntryInput): Promise<number> {
    const id = await DB.createEntry(input);
    await refresh();
    return id;
  }

  async function editEntry(id: number, input: NewEntryInput): Promise<void> {
    await DB.updateEntry(id, input);
    await refresh();
  }

  async function removeEntry(id: number): Promise<void> {
    await DB.deleteEntry(id);
    await refresh();
  }

  return { entries, loading, refresh, addEntry, editEntry, removeEntry };
}

export function useEntry(id: number) {
  const [entry, setEntry] = useState<PlatedEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DB.getEntryById(id).then(data => {
      setEntry(data);
      setLoading(false);
    });
  }, [id]);

  return { entry, loading };
}
