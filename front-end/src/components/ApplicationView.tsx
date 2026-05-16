import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import type { AppDispatch, RootState } from "@/app/store";
import {
  deleteApplication,
  fetchApplicationById,
  updateApplication,
  type Application as ApplicationType,
} from "@/app/application/appSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import formatTimestamp from "@/utils/formatTimestamp";

type LinkItem = string | { url: string; label?: string };

const levelLabels: Record<string, string> = {
  entry_level: "Entry Level",
  mid_level: "Mid Level",
  senior_level: "Senior Level",
  executive_level: "Executive Level",
};

const workTypeLabels: Record<string, string> = {
  remote: "Remote",
  on_site: "On-site",
};

function formatSalary(min: number, max: number) {
  return `$${(min / 1000).toFixed(1)}k – $${(max / 1000).toFixed(1)}k`;
}

function formatDeadline(deadline: string) {
  return new Date(deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const normalizeLinks = (links?: ApplicationType["links"]) => {
  const normalized =
    (links as LinkItem[] | undefined)?.map((link) =>
      typeof link === "string" ? link : link.url,
    ) ?? [];
  return normalized.length > 0 ? normalized : [""];
};

const ApplicationView = () => {
  const { appId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    current: app,
    loading,
    error,
    submitting,
  } = useSelector((state: RootState) => state.applications);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const currentUserId = authUser?.id;
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [draftCoverLetter, setDraftCoverLetter] = useState("");
  const [draftLinks, setDraftLinks] = useState<string[]>([""]);

  useEffect(() => {
    if (appId) {
      dispatch(fetchApplicationById(Number(appId)));
    }
  }, [dispatch, appId]);

  if (loading) {
    return (
      <div className="border border-border/70 bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">Loading application…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-border/70 bg-card p-4 shadow-sm">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="border border-border/70 bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">Application not found.</p>
      </div>
    );
  }

  const candidateName = app.candidate?.name || "Unknown candidate";
  const avatarSrc =
    app.candidate && "avatar" in app.candidate
      ? (app.candidate as { avatar?: string }).avatar
      : undefined;
  const resumeUrl = app.candidate?.resume_url ?? "";
  const isEmployer = authUser?.role === "employer";
  const chatContact = isEmployer
    ? app.candidate
      ? { id: app.candidate.id, name: app.candidate.name }
      : null
    : app.job?.employer_id
      ? { id: app.job.employer_id, name: "Employer" }
      : null;
  const canChat = Boolean(currentUserId && chatContact);
  const chatLabel = isEmployer ? "Chat with Candidate" : "Chat with Employer";
  const canManage = Boolean(
    currentUserId &&
    app.candidate_id === currentUserId &&
    app.status === "pending",
  );

  const handleStartEdit = () => {
    setDraftCoverLetter(app.cover_letter);
    setDraftLinks(normalizeLinks(app.links));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    const trimmedCoverLetter = draftCoverLetter.trim();
    if (trimmedCoverLetter.length < 100) {
      toast.error("Cover letter must be at least 100 characters.");
      return;
    }

    const links = draftLinks.map((link) => link.trim()).filter(Boolean);
    const result = await dispatch(
      updateApplication({
        applicationId: app.id,
        cover_letter: trimmedCoverLetter,
        links,
      }),
    );

    if (updateApplication.fulfilled.match(result)) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this application?")) return;
    await dispatch(deleteApplication(app.id));
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="border border-border/70 bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src={
                avatarSrc ||
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBwbGljYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
              }
              alt={candidateName}
              className="w-10 h-10 object-cover rounded-full mb-6"
            />
            <div>
              <h3>{candidateName}</h3>
              <p className="text-muted-foreground mb-6 text-xs">
                {formatTimestamp(app.created_at)}
              </p>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary underline"
                >
                  Download resume
                </a>
              )}
            </div>
          </div>
          {canManage ? (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleStartEdit}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={submitting}
              >
                Delete
              </Button>
            </div>
          ) : null}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Cover letter</p>
              <Textarea
                value={draftCoverLetter}
                onChange={(event) => setDraftCoverLetter(event.target.value)}
                rows={6}
                className="min-h-32"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 100 characters.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Links</p>
              {draftLinks.map((link, index) => (
                <div key={`${app.id}-link-${index}`} className="flex gap-2">
                  <Input
                    value={link}
                    onChange={(event) => {
                      const nextLinks = [...draftLinks];
                      nextLinks[index] = event.target.value;
                      setDraftLinks(nextLinks);
                    }}
                    placeholder="https://linkedin.com/in/..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setDraftLinks((prev) =>
                        prev.length > 1
                          ? prev.filter((_, i) => i !== index)
                          : prev,
                      )
                    }
                    disabled={draftLinks.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setDraftLinks((prev) => [...prev, ""])}
              >
                Add link
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={submitting}>
                Save
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className=" border border-border/70 bg-card p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">
                {app.cover_letter.length > 200
                  ? app.cover_letter.substring(0, 200) + "..."
                  : app.cover_letter}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Links</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {(app.links as LinkItem[] | undefined)?.length ? (
                  (app.links as LinkItem[]).map((link, index) => {
                    const linkUrl = typeof link === "string" ? link : link.url;
                    const linkLabel =
                      typeof link === "string" ? link : link.label || link.url;
                    return (
                      <li key={index}>
                        <a
                          href={linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          {linkLabel}
                        </a>
                      </li>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No links provided.
                  </p>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      <aside className=" border border-border/70 bg-card p-6 shadow-sm space-y-3">
        <p className="text-sm">
          Status:{" "}
          <span className="inline-block rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {app.job?.status ?? "-"}
          </span>
        </p>
        <p className="text-sm">
          Title:{" "}
          <span className="font-medium text-foreground">
            {app.job?.title ?? "-"}
          </span>
        </p>
        <p className="text-sm">
          Location:{" "}
          <span className="font-medium text-foreground">
            {app.job?.location ?? "-"}
          </span>
        </p>
        <p className="text-sm">
          Work Type:{" "}
          <span className="font-medium text-foreground">
            {app.job?.work_type
              ? (workTypeLabels[app.job.work_type] ?? app.job.work_type)
              : "-"}
          </span>
        </p>
        <p className="text-sm">
          Experience Level:{" "}
          <span className="font-medium text-foreground">
            {app.job?.experience_level
              ? (levelLabels[app.job.experience_level] ??
                app.job.experience_level)
              : "-"}
          </span>
        </p>
        <p className="text-sm">
          Budget:{" "}
          <span className="font-medium text-foreground">
            {app.job?.salary_min !== undefined &&
            app.job?.salary_max !== undefined
              ? formatSalary(app.job.salary_min, app.job.salary_max)
              : "-"}
          </span>
        </p>
        <p className="text-sm">
          Deadline:{" "}
          <span className="font-medium text-foreground">
            {app.job?.deadline ? formatDeadline(app.job.deadline) : "-"}
          </span>
        </p>
        {app.job?.skills?.length ? (
          <div className="pt-2">
            <p className="mb-2 text-sm">Skills:</p>
            <div className="flex flex-wrap gap-2">
              {app.job.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-block rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </aside>
      <div>
        <Button
          variant="outline"
          className="w-full"
          disabled={!canChat}
          onClick={() => {
            if (!canChat || !chatContact) return;
            navigate(`/chat/${chatContact.id}`, {
              state: {
                contactName: chatContact.name,
              },
            });
          }}
        >
          {chatLabel}
        </Button>
        {!canChat && (
          <p className="mt-2 text-xs text-muted-foreground">
            Chat is available after an application is submitted.
          </p>
        )}
      </div>
    </div>
  );
};

export default ApplicationView;
