import { Button } from "@/components/ui/button";
import { useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  clearAuthError,
  completeCandidateProfile,
  completeEmployerProfile,
  selectAuth,
} from "@/app/auth/authSlice";
import { useNavigate } from "react-router-dom";

export function CompleteProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector(selectAuth);

  const [role, setRole] = useState<"candidate" | "employer">("candidate");

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [socialLinks, setSocialLinks] = useState<string[]>([""]);
  const [localError, setLocalError] = useState<Record<string, string | null>>(
    {},
  );
  console.log(localError);

  const candidate = {
    header: "Complete Your Profile",
    inputs: [
      {
        name: "headline",
        label: "Professional Headline",
        type: "text",
        placeholder: "e.g., Senior React Developer",
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "+20 100 000 0000",
      },
      {
        name: "location",
        label: "Location",
        type: "text",
        placeholder: "e.g., Cairo, Egypt",
      },
      {
        name: "resume_url",
        label: "Resume Link",
        type: "url",
        placeholder: "https://drive.google.com/...",
      },
    ],
  };

  const employer = {
    header: "Complete Your Company Profile",
    inputs: [
      {
        name: "company_name",
        label: "Company Name",
        type: "text",
      },
      {
        name: "company_website",
        label: "Company Website",
        type: "url",
        placeholder: "https://www.yourcompany.com",
      },
      {
        name: "company_description",
        label: "Company Description",
        type: "text",
        placeholder: "Tell candidates about your company",
      },
      {
        name: "company_logo",
        label: "Company Logo URL",
        type: "url",
        placeholder: "https://...",
      },
      {
        name: "company_location",
        label: "Company Location",
        type: "text",
        placeholder: "e.g., Cairo, Egypt",
      },
    ],
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError({});
    dispatch(clearAuthError());

    try {
      if (role === "candidate") {
        const social_media = socialLinks
          .map((item) => item.trim())
          .filter(Boolean);

        // handle errors
        if (!formData.headline && formData.headline.trim() === "") {
          setLocalError((prev) => ({
            ...prev,
            headline: "Headline cannot be empty",
          }));
          return;
        }
        if (formData.phone && formData.phone.trim() === "") {
          setLocalError((prev) => ({
            ...prev,
            phone: "Phone number cannot be empty",
          }));
          return;
        }
        if (formData.location && formData.location.trim() === "") {
          setLocalError((prev) => ({
            ...prev,
            location: "Location cannot be empty",
          }));
          return;
        }
        if (formData.resume_url && formData.resume_url.trim() === "") {
          setLocalError((prev) => ({
            ...prev,
            resume_url: "Resume URL cannot be empty",
          }));
          return;
        }

        await dispatch(
          completeCandidateProfile({
            headline: formData.headline?.trim() || undefined,
            phone: formData.phone?.trim() || undefined,
            location: formData.location?.trim() || undefined,
            resume_url: formData.resume_url?.trim() || undefined,
            social_media: social_media.length ? social_media : undefined,
          }),
        ).unwrap();
      } else {
        if (!formData.company_name?.trim()) {
          setLocalError((prev) => ({
            ...prev,
            company_name: "Company name is required",
          }));
          return;
        }

        await dispatch(
          completeEmployerProfile({
            company_name: formData.company_name.trim(),
            company_website: formData.company_website?.trim() || undefined,
            company_description:
              formData.company_description?.trim() || undefined,
            company_logo: formData.company_logo?.trim() || undefined,
            company_location: formData.company_location?.trim() || undefined,
          }),
        ).unwrap();
      }
      navigate("/");
    } catch {
      // Error is managed in slice and shown below.
    }
  };

  return (
    <div className="min-h-dvh grid place-items-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Please complete your profile to access all features.
          </p>
        </div>

        {/* Role Selection */}
        <div className="my-4">
          <label className="mr-4">
            <input
              type="radio"
              name="role"
              value="candidate"
              checked={role === "candidate"}
              onChange={() => {
                setRole("candidate");
                setFormData({});
                setSocialLinks([""]);
                setLocalError({});
                dispatch(clearAuthError());
              }}
              className="mr-1"
            />
            Candidate
          </label>
          <label className="mr-4">
            <input
              type="radio"
              name="role"
              value="employer"
              checked={role === "employer"}
              onChange={() => {
                setRole("employer");
                setFormData({});
                setSocialLinks([""]);
                setLocalError({});
                dispatch(clearAuthError());
              }}
              className="mr-1"
            />
            Employer
          </label>
        </div>
        <form onSubmit={handleSubmit}>
          {(role === "candidate" ? candidate.inputs : employer.inputs).map(
            (input) => (
              <label key={input.name} className="block space-y-1.5 p-2">
                <span className="text-sm font-medium mb-2">{input.label}</span>
                <input
                  className="h-10 w-full rounded-md border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  type={input.type}
                  placeholder={input.placeholder}
                  value={formData[input.name] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [input.name]: e.target.value })
                  }
                />
                {localError && localError[input.name] && (
                  <p className="text-sm text-destructive" role="alert">
                    {localError[input.name]}
                  </p>
                )}
              </label>
            ),
          )}

          {role === "candidate" && (
            <div className="space-y-2 p-2">
              <span className="text-sm font-medium">Social Links</span>
              {socialLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    className="h-10 w-full rounded-md border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={link}
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[index] = e.target.value;
                      setSocialLinks(updated);
                    }}
                  />
                  {socialLinks.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setSocialLinks(
                          socialLinks.filter((_, i) => i !== index),
                        )
                      }
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setSocialLinks([...socialLinks, ""])}
              >
                Add social link
              </Button>
            </div>
          )}
          {(localError || auth.error) && (
            <p className="px-2 text-sm text-destructive" role="alert">
              {localError ? localError[Object.keys(localError)[0]] : auth.error}
            </p>
          )}
          <Button
            className="w-full mt-4"
            type="submit"
            disabled={auth.isLoading}
          >
            {auth.isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
