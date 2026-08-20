import { Mail, Phone, MapPin } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { FreeQuoteFormValues } from './schema';

export function ContactStep({ form }: { form: UseFormReturn<FreeQuoteFormValues> }) {
  return (
    <>
      <div>
        <h2 className="text-lg font-bold text-slate-900">Contact information</h2>
        <p className="text-sm text-slate-600">So we know who to send the quote to, and where.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <FormControl>
                  <Input {...field} className="pl-9" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <FormControl>
                  <Input {...field} className="pl-9" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Home Address</FormLabel>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <FormControl>
                <Input {...field} placeholder="Street address" className="pl-9" />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_0.8fr_0.8fr] gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Kansas City" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input {...field} placeholder="MO" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP</FormLabel>
              <FormControl>
                <Input {...field} placeholder="64111" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
