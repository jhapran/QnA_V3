import { useState } from 'react';
import { databaseService } from '@/lib/services/databaseService';
import { toast } from 'sonner';

export function useDatabase<T>(initialData: T[] = []) {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (
    fetchFn: () => Promise<T[]>,
    successMessage?: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
      if (successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createItem = async (
    createFn: () => Promise<T>,
    successMessage = 'Item created successfully'
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createFn();
      setData(prev => [result, ...prev]);
      toast.success(successMessage);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create item';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (
    updateFn: () => Promise<T>,
    successMessage = 'Item updated successfully'
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await updateFn();
      setData(prev =>
        prev.map(item =>
          (item as any).id === (result as any).id ? result : item
        )
      );
      toast.success(successMessage);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update item';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (
    deleteFn: () => Promise<void>,
    itemId: string,
    successMessage = 'Item deleted successfully'
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteFn();
      setData(prev => prev.filter(item => (item as any).id !== itemId));
      toast.success(successMessage);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete item';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
  };
}