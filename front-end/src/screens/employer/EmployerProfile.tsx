import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import {
  fetchEmployerProfileThunk,
  updateEmployerProfileThunk,
  uploadLogoThunk,
  uploadAvatarThunk,
} from "@/app/employer/employerSlice";
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

export default function EmployerProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, isLoading, error, isUpdating, updateError } = useSelector(
    (state: RootState) => state.employer,
  );

  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");

  useEffect(() => {
    dispatch(fetchEmployerProfileThunk());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setCompanyName(profile.company_name ?? "");
      setCompanyWebsite(profile.company_website ?? "");
      setCompanyLocation(profile.company_location ?? "");
      setCompanyDescription(profile.company_description ?? "");
    }
  }, [profile]);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(
      updateEmployerProfileThunk({
        company_name: companyName.trim() || undefined,
        company_website: companyWebsite.trim() || undefined,
        company_location: companyLocation.trim() || undefined,
        company_description: companyDescription.trim() || undefined,
      }),
    );
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(uploadLogoThunk(file));
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(uploadAvatarThunk(file));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Profile</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Update your company details and branding
        </p>
      </div>

      {(error || updateError) && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {updateError || error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
          <CardDescription>Keep your employer profile current</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="Acme Corp"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_website">Company Website</Label>
                  <Input
                    id="company_website"
                    value={companyWebsite}
                    onChange={(event) => setCompanyWebsite(event.target.value)}
                    placeholder="https://company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_location">Location</Label>
                  <Input
                    id="company_location"
                    value={companyLocation}
                    onChange={(event) => setCompanyLocation(event.target.value)}
                    placeholder="Cairo, Egypt"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_description">Description</Label>
                <Textarea
                  id="company_description"
                  value={companyDescription}
                  onChange={(event) =>
                    setCompanyDescription(event.target.value)
                  }
                  placeholder="Tell candidates about your company"
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
          <CardDescription>Company logo and avatar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
            />
            {profile?.company_logo && (
              <a
                href={profile.company_logo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline"
              >
                View current logo
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
