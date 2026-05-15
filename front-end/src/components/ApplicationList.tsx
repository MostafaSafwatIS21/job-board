import Application from "./Application";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { Link } from "react-router-dom";

const ApplicationList = () => {
  const { items, loading, error } = useSelector(
    (state: RootState) => state.applications,
  );
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const sortedItems = [...items].sort((a, b) => {
    const aMine = currentUserId ? a.candidate_id === currentUserId : false;
    const bMine = currentUserId ? b.candidate_id === currentUserId : false;
    if (aMine === bMine) return 0;
    return aMine ? -1 : 1;
  });

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading applications…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No applications yet.</p>
      ) : (
        sortedItems.map((app) => (
          <Link to={`/application/${app.id}`} key={app.id}>
            <Application
              app={app}
              isOwner={currentUserId === app.candidate_id}
            />
          </Link>
        ))
      )}
    </div>
  );
};

export default ApplicationList;
