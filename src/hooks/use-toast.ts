import { toast as sonnerToast } from 'sonner';

export type ToastVariant = 'default' | 'destructive' | 'success';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

export const useToast = () => {
  const toast = ({ title = '', description = '', variant = 'default' }: ToastOptions) => {
    const message = `${title}${description ? `: ${description}` : ''}`;
    
    switch (variant) {
      case 'destructive':
        sonnerToast.error(message);
        break;
      case 'success':
        sonnerToast.success(message);
        break;
      default:
        sonnerToast(message);
    }
  };

  return { toast };
};
