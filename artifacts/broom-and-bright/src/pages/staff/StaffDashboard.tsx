import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { staffApi } from './staffApi';
import { BookingsPanel } from './BookingsPanel';
import { AvailabilityPanel } from './AvailabilityPanel';
import { TeamPanel } from './TeamPanel';
import { CalendarSyncPanel } from './CalendarSyncPanel';
import type { StaffMember } from './types';

export default function StaffDashboard() {
  useDocumentHead('Staff Dashboard | TrueClean KC', 'Manage bookings and availability.', '/staff/dashboard');

  const [, navigate] = useLocation();
  const [me, setMe] = useState<StaffMember | null | undefined>(undefined); // undefined = still checking
  const [allStaff, setAllStaff] = useState<StaffMember[]>([]);

  const loadStaffList = async (currentUser: StaffMember) => {
    if (currentUser.role === 'owner') {
      const { staff } = await staffApi.listStaff();
      setAllStaff(staff);
    } else {
      setAllStaff([currentUser]);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { staff } = await staffApi.me();
        if (!staff) {
          navigate('/staff/login');
          return;
        }
        setMe(staff);
        await loadStaffList(staff);
      } catch {
        navigate('/staff/login');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    await staffApi.logout();
    navigate('/staff/login');
  };

  if (me === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  }
  if (!me) return null; // navigating away

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-900">TrueClean KC — Staff</div>
            <div className="text-xs text-slate-500">
              {me.name} · <span className="uppercase">{me.role}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8 max-w-3xl">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6">
          <Tabs defaultValue="bookings">
            <TabsList>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="sync">Sync</TabsTrigger>
              {me.role === 'owner' && <TabsTrigger value="team">Team</TabsTrigger>}
            </TabsList>

            <TabsContent value="bookings" className="pt-6">
              <BookingsPanel me={me} allStaff={allStaff} />
            </TabsContent>

            <TabsContent value="availability" className="pt-6">
              <AvailabilityPanel me={me} allStaff={allStaff} />
            </TabsContent>

            <TabsContent value="sync" className="pt-6">
              <CalendarSyncPanel />
            </TabsContent>

            {me.role === 'owner' && (
              <TabsContent value="team" className="pt-6">
                <TeamPanel staff={allStaff} onStaffAdded={() => loadStaffList(me)} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
