import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import {
  fetchCandidateProfileThunk,
  updateCandidateProfileThunk,
  uploadResumeThunk,
  uploadCandidateAvatarThunk,
} from "@/app/candidate/candidateSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CandidateProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, isLoading, error, isUpdating, updateError } = useSelector(
    (state: RootState) => state.candidate,
  );

  const [headline, setHeadline] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [socialMediaText, setSocialMediaText] = useState("");

  useEffect(() => {
    dispatch(fetchCandidateProfileThunk());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      const socialMedia = Array.isArray(profile.social_media)
        ? profile.social_media
        : profile.social_media
          ? [String(profile.social_media)]
          : [];
      setHeadline(profile.headline ?? "");
      setPhone(profile.phone ?? "");
      setLocation(profile.location ?? "");
      setSocialMediaText(socialMedia.join(", "));
    }
  }, [profile]);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const social_media = socialMediaText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    dispatch(
      updateCandidateProfileThunk({
        headline: headline.trim() || undefined,
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
        social_media: social_media.length ? social_media : undefined,
      }),
    );
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(uploadResumeThunk(file));
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(uploadCandidateAvatarThunk(file));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Update your candidate profile and uploads
        </p>
      </div>

      {(error || updateError) && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {updateError || error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Keep your info up to date</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={headline}
                  onChange={(event) => setHeadline(event.target.value)}
                  placeholder="e.g., Frontend Developer"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+20 10 000 0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Cairo, Egypt"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="social">Social links (comma separated)</Label>
                <Textarea
                  id="social"
                  value={socialMediaText}
                  onChange={(event) => setSocialMediaText(event.target.value)}
                  placeholder="https://linkedin.com/in/... , https://github.com/..."
                />
              </div>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploads</CardTitle>
          <CardDescription>Resume and avatar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume (PDF)</Label>
            <Input
              id="resume"
              type="file"
              accept="application/pdf"
              onChange={handleResumeUpload}
            />
            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline"
              >
                View current resume
              </a>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Profile Avatar</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
            <p className="text-xs text-muted-foreground">
              Avatar upload updates your user avatar.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
