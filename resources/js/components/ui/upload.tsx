import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, X, FileIcon, ImageIcon } from "lucide-react";

export interface UploadProps {
  value?: File | File[] | null;
  onChange?: (files: File | File[] | null) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  showPreview?: boolean;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const isImageFile = (file: File) => {
  return file.type.startsWith("image/");
};

export const Upload = React.forwardRef<HTMLInputElement, UploadProps>(
  (
    {
      value,
      onChange,
      accept = "image/*",
      multiple = false,
      maxSize = 5,
      disabled = false,
      className,
      placeholder = "Klik atau drag file ke sini",
      showPreview = true,
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [previews, setPreviews] = React.useState<string[]>([]);

    const files = React.useMemo(() => {
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    }, [value]);

    React.useEffect(() => {
      if (showPreview && files.length > 0) {
        const newPreviews: string[] = [];
        files.forEach((file) => {
          if (isImageFile(file)) {
            const reader = new FileReader();
            reader.onload = (e) => {
              newPreviews.push(e.target?.result as string);
              if (newPreviews.length === files.filter(isImageFile).length) {
                setPreviews([...newPreviews]);
              }
            };
            reader.readAsDataURL(file);
          }
        });
      } else {
        setPreviews([]);
      }
    }, [files, showPreview]);

    const handleClick = () => {
      if (!disabled) {
        inputRef.current?.click();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      processFiles(selectedFiles);
    };

    const processFiles = (selectedFiles: File[]) => {
      const validFiles = selectedFiles.filter((file) => {
        const sizeInMB = file.size / (1024 * 1024);
        if (sizeInMB > maxSize) {
          console.warn(`File ${file.name} exceeds max size of ${maxSize}MB`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      if (multiple) {
        onChange?.(validFiles);
      } else {
        onChange?.(validFiles[0]);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (!disabled) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        processFiles(droppedFiles);
      }
    };

    const handleRemove = (index: number) => {
      if (multiple && Array.isArray(value)) {
        const newFiles = [...value];
        newFiles.splice(index, 1);
        onChange?.(newFiles.length > 0 ? newFiles : null);
      } else {
        onChange?.(null);
      }
    };

    const handleRemoveAll = () => {
      onChange?.(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    return (
      <div className={cn("space-y-3", className)}>
        {/* Upload Area */}
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
            "flex flex-col items-center justify-center gap-2 text-center",
            isDragging && "border-primary bg-primary/5",
            !isDragging && "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            disabled && "opacity-50 cursor-not-allowed hover:border-muted-foreground/25 hover:bg-transparent"
          )}
        >
          <input
            ref={(node) => {
              (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleChange}
            className="hidden"
          />
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UploadIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{placeholder}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Maks {maxSize}MB {accept !== "*" && `• ${accept.replace(/,/g, ", ")}`}
            </p>
          </div>
        </div>

        {/* File Preview */}
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {files.length} file dipilih
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveAll}
                className="text-destructive hover:text-destructive h-7 px-2"
              >
                Hapus Semua
              </Button>
            </div>
            <div className="grid gap-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                >
                  {/* Thumbnail or Icon */}
                  {showPreview && isImageFile(file) && previews[index] ? (
                    <img
                      src={previews[index]}
                      alt={file.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                      {isImageFile(file) ? (
                        <ImageIcon className="h-5 w-5 text-primary" />
                      ) : (
                        <FileIcon className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  )}
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Upload.displayName = "Upload";
