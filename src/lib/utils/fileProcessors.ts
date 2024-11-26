import { toast } from 'sonner';

export async function processTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        resolve(text);
      } else {
        reject(new Error('Failed to read text file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export async function processFile(file: File): Promise<string> {
  const fileType = file.name.split('.').pop()?.toLowerCase();

  try {
    switch (fileType) {
      case 'txt':
      case 'md':
        return processTextFile(file);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Document processing error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to process file');
    throw error;
  }
}