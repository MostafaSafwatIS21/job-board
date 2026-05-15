import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import type { AppDispatch, RootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import formatTimestamp from "@/utils/formatTimestamp";
import {
  deleteApplication,
  updateApplication,
  type Application as ApplicationType,
} from "@/app/application/appSlice";

interface ApplicationProps {
  app: ApplicationType;
  isOwner: boolean;
}

type LinkItem = string | { url: string; label?: string };

const statusBadge: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-amber-500/10", text: "text-amber-600" },
  approved: { bg: "bg-green-500/10", text: "text-green-600" },
  rejected: { bg: "bg-red-500/10", text: "text-red-600" },
};

const normalizeLinks = (links?: ApplicationType["links"]) => {
  const normalized =
    (links as LinkItem[] | undefined)?.map((link) =>
      typeof link === "string" ? link : link.url,
    ) ?? [];
  return normalized.length > 0 ? normalized : [""];
};

const Application = ({ app, isOwner }: ApplicationProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isSubmitting = useSelector(
    (state: RootState) => state.applications.submitting,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [draftCoverLetter, setDraftCoverLetter] = useState(app.cover_letter);
  const [draftLinks, setDraftLinks] = useState<string[]>(
    normalizeLinks(app.links),
  );
  const canManage = isOwner && app.status === "pending";

  const candidateName = app.candidate?.name || "Unknown candidate";
  const avatarSrc =
    app.candidate && "avatar" in app.candidate
      ? (app.candidate as { avatar?: string }).avatar
      : undefined;

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
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
              statusBadge[app.status]?.bg
            } ${statusBadge[app.status]?.text}`}
          >
            {app.status}
          </span>
          {canManage ? (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleStartEdit}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete
              </Button>
            </div>
          ) : null}
        </div>
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
            <Button onClick={handleSave} disabled={isSubmitting}>
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
      <div></div>
    </div>
  );
};

export default Application;
