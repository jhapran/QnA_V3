import { useState, useRef } from 'react';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { processFile } from '@/lib/utils/fileProcessors';

interface DocumentUploadProps {
  onContentExtracted: (content: string) => void;
  disabled?: boolean;
}

export function DocumentUpload({ onContentExtracted, disabled }: DocumentUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = {
    'text/plain': '.txt',
    'text/markdown': '.md'
  };

  const acceptedFileTypes = Object.values(supportedFormats).join(',');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setFileName(file.name);

    try {
      const content = await processFile(file);
      if (!content.trim()) {
        throw new Error('No text content found in the document');
      }
      onContentExtracted(content);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process document';
      setError(`${errorMessage}. Please try again.`);
      console.error('Document processing error:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    if (!file) return;

    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!Object.values(supportedFormats).includes(fileExtension)) {
      setError('Unsupported file type. Please upload a supported document format.');
      return;
    }

    const input = fileInputRef.current;
    if (input) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      handleFileUpload({ target: input } as any);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Upload Document</h3>
        <span className="text-sm text-gray-500">
          Supported formats: TXT, MD
        </span>
      </div>

      <div
        onClick={() => !disabled && !isProcessing && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex cursor-pointer items-center justify-center space-x-2 rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 transition-colors hover:border-gray-400 ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedFileTypes}
          onChange={handleFileUpload}
          disabled={disabled || isProcessing}
        />
        
        {isProcessing ? (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing document...</span>
          </div>
        ) : fileName ? (
          <div className="flex items-center space-x-2 text-green-600">
            <FileText className="h-5 w-5" />
            <span>{fileName}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <span className="text-blue-600">Click to upload</span>
              <span className="text-gray-500"> or drag and drop</span>
            </div>
            <p className="text-sm text-gray-500">Upload a document to generate questions</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}