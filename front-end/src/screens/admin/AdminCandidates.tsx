import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsersIcon } from "@phosphor-icons/react";

export default function AdminCandidates() {
  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage candidate profiles and activity
        </p>
      </div>

      {/* ── Placeholder ────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Candidates Management
          </CardTitle>
          <CardDescription>
            This feature will allow you to view and manage all candidate
            profiles
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold mb-2">Coming Soon</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Candidate management features are coming in the next update.
              You'll be able to view candidate profiles, search by skills, and
              monitor application activity.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
