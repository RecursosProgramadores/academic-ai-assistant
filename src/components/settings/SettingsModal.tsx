import { Settings, Info, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SettingsModal Component
 * Configuration and information panel
 */
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configuración
          </DialogTitle>
          <DialogDescription>
            Información del asistente y configuración
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* About Section */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Acerca del Asistente
            </h3>
            <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Este asistente de IA está diseñado para ayudarte con tu curso universitario.
                Puede responder preguntas, explicar conceptos y resolver ejercicios paso a paso.
              </p>
              <p className="text-sm text-muted-foreground">
                Utiliza inteligencia artificial para proporcionar respuestas precisas basadas
                en el contenido del curso que hayas subido.
              </p>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* API Status */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Estado de la API
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-muted-foreground">
                Pendiente de configuración del backend
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Configura la URL del backend en el archivo .env para conectar con FastAPI.
            </p>
          </div>

          <Separator className="bg-border" />

          {/* Features */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Funcionalidades
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Respuestas basadas en el contenido del curso
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Soporte para Markdown y código
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Explicaciones paso a paso
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Subida de documentos PDF, TXT, DOCX
              </li>
            </ul>
          </div>

          <Separator className="bg-border" />

          {/* Version */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Versión 1.0.0</span>
            <a
              href="#"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              Documentación
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
