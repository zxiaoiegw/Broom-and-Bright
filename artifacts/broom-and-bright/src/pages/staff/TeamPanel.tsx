import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { staffApi } from './staffApi';
import type { StaffMember } from './types';

export function TeamPanel({ staff, onStaffAdded }: { staff: StaffMember[]; onStaffAdded: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'cleaner' as 'owner' | 'cleaner' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      await staffApi.addStaff(form);
      setSuccess(`${form.name} can now sign in with the password you set.`);
      setForm({ name: '', email: '', password: '', role: 'cleaner' });
      onStaffAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add staff.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">Team</h3>
        <div className="space-y-2">
          {staff.map((s) => (
            <div key={s.id} className="flex items-center justify-between text-sm rounded-lg border border-slate-200 px-3 py-2">
              <span>
                <span className="font-semibold">{s.name}</span>{' '}
                <span className="text-slate-400">({s.email})</span>
              </span>
              <span className="text-xs font-semibold uppercase text-slate-500">{s.role}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Add a staff member</h3>
        <form onSubmit={onSubmit} className="space-y-3 max-w-sm">
          <Input
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Temporary password (8+ characters)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength={8}
            required
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as 'owner' | 'cleaner' })}
            className="h-9 w-full rounded-md border border-input px-2 text-sm"
          >
            <option value="cleaner">Cleaner</option>
            <option value="owner">Owner (full access)</option>
          </select>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          {success && <p className="text-sm font-medium text-emerald-600">{success}</p>}

          <Button type="submit" size="sm" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add staff member'}
          </Button>
        </form>
      </div>
    </div>
  );
}
