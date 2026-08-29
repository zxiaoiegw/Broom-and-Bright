import { Check, Upload } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { FreeQuoteFormValues } from './schema';

interface HomeDetailsStepProps {
  form: UseFormReturn<FreeQuoteFormValues>;
  photos: File[];
  photoErrors: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoDrop: (e: React.DragEvent<HTMLElement>) => void;
  onPhotoDragOver: (e: React.DragEvent<HTMLElement>) => void;
  onRemovePhoto: (index: number) => void;
}

export function HomeDetailsStep({
  form,
  photos,
  photoErrors,
  onPhotoChange,
  onPhotoDrop,
  onPhotoDragOver,
  onRemovePhoto,
}: HomeDetailsStepProps) {
  return (
    <>
      <div>
        <h2 className="text-lg font-bold text-slate-900">Property details</h2>
        <p className="text-sm text-slate-600">Helps us estimate time and crew size.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrooms</FormLabel>
              <FormControl>
                <div className="flex items-center justify-between h-11 rounded-md border border-input pl-4 pr-1.5 shadow-sm">
                  <span className="text-sm font-semibold">{field.value}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => field.onChange(Math.max(1, field.value - 1))}
                      className="w-8 h-8 rounded-md border border-input bg-[#6ba4b8]/10 text-[#6ba4b8] font-bold hover-elevate"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange(Math.min(10, field.value + 1))}
                      className="w-8 h-8 rounded-md border border-input bg-[#6ba4b8]/10 text-[#6ba4b8] font-bold hover-elevate"
                    >
                      +
                    </button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bathrooms</FormLabel>
              <FormControl>
                <div className="flex items-center justify-between h-11 rounded-md border border-input pl-4 pr-1.5 shadow-sm">
                  <span className="text-sm font-semibold">{field.value}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => field.onChange(Math.max(1, field.value - 1))}
                      className="w-8 h-8 rounded-md border border-input bg-[#6ba4b8]/10 text-[#6ba4b8] font-bold hover-elevate"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange(Math.min(10, field.value + 1))}
                      className="w-8 h-8 rounded-md border border-input bg-[#6ba4b8]/10 text-[#6ba4b8] font-bold hover-elevate"
                    >
                      +
                    </button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="pets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Do you have pets?</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => field.onChange('yes')}
                    className={cn(
                      'flex-1 h-11 rounded-md text-sm font-bold flex items-center justify-center gap-1.5 border',
                      field.value === 'yes'
                        ? 'border-[#6ba4b8] bg-[#6ba4b8]/10 text-[#6ba4b8]'
                        : 'border-input bg-transparent text-slate-600',
                    )}
                  >
                    {field.value === 'yes' && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange('no')}
                    className={cn(
                      'flex-1 h-11 rounded-md text-sm font-semibold border',
                      field.value === 'no'
                        ? 'border-[#6ba4b8] bg-[#6ba4b8]/10 text-[#6ba4b8]'
                        : 'border-input bg-transparent text-slate-600',
                    )}
                  >
                    No
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="squareFeet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Square Feet</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. 1,800" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-100">
        <label className="text-sm font-medium block pt-4">
          Photos <span className="font-normal text-slate-400">(optional, up to 10)</span>
        </label>

        {photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {photos.map((file, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemovePhoto(index)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/80"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <label
          onDragOver={onPhotoDragOver}
          onDrop={onPhotoDrop}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#6ba4b8]/40 bg-[#6ba4b8]/10 rounded-2xl h-28 cursor-pointer text-sm text-[#6ba4b8] hover:border-[#6ba4b8] transition-colors"
        >
          <Upload className="w-6 h-6" />
          <span className="font-semibold">Drag &amp; drop photos, or click to browse</span>
          <span className="text-xs text-slate-400 font-normal">JPG or PNG, up to 5MB each</span>
          <input type="file" accept="image/*" multiple onChange={onPhotoChange} className="hidden" />
        </label>
        {photoErrors && <p className="text-[0.8rem] font-medium text-destructive">{photoErrors}</p>}
      </div>
    </>
  );
}
