import { useState, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { uploadDocument } from '@/services/api';
import { UploadedDocument } from '@/types/chat';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (document: UploadedDocument) => void;
}

const ACCEPTED_TYPES = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ACCEPTED_EXTENSIONS = '.pdf,.txt,.docx';

/**
 * FileUploadModal Component
 * Modal for uploading course documents for RAG context
 */
export function FileUploadModal({ isOpen, onClose, onUploadComplete }: FileUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDocument[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    setError(null);

    for (const file of files) {
      // Validate file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(`Tipo de archivo no soportado: ${file.name}. Solo PDF, TXT y DOCX.`);
        continue;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(`Archivo muy grande: ${file.name}. Máximo 10MB.`);
        continue;
      }

      const newDoc: UploadedDocument = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        status: 'uploading',
      };

      setUploadedFiles((prev) => [...prev, newDoc]);

      try {
        // Upload to backend
        const response = await uploadDocument(file);

        setUploadedFiles((prev) =>
          prev.map((doc) =>
            doc.id === newDoc.id
              ? { ...doc, status: response.success ? 'ready' : 'error' }
              : doc
          )
        );

        if (response.success && onUploadComplete) {
          onUploadComplete({ ...newDoc, status: 'ready' });
        }
      } catch (err) {
        console.error('Upload error:', err);
        setUploadedFiles((prev) =>
          prev.map((doc) =>
            doc.id === newDoc.id ? { ...doc, status: 'error' } : doc
          )
        );
      }
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((doc) => doc.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusIcon = (status: UploadedDocument['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Subir Documentos del Curso
          </DialogTitle>
          <DialogDescription>
            Sube documentos PDF, TXT o DOCX para que el asistente pueda responder
            preguntas basadas en el contenido del curso.
          </DialogDescription>
        </DialogHeader>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          )}
        >
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-foreground mb-2">
            Arrastra archivos aquí o{' '}
            <label className="text-primary cursor-pointer hover:underline">
              selecciona archivos
              <input
                type="file"
                accept={ACCEPTED_EXTENSIONS}
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, TXT, DOCX hasta 10MB
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uploadedFiles.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 bg-secondary/50 rounded-lg px-3 py-2"
              >
                <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(doc.size)}
                  </p>
                </div>
                {getStatusIcon(doc.status)}
                <button
                  onClick={() => removeFile(doc.id)}
                  className="p-1 hover:bg-background rounded"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
