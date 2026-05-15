"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/app/store";
import { createJobListing } from "@/app/jobListing/jobListSlice";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BriefcaseIcon, PlusIcon, XIcon } from "@phosphor-icons/react";

// ─── Zod Schema ────────────────────────────────────────────────────────────

const jobListingSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(255, "Title must not exceed 255 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must not exceed 5000 characters"),
  location: z
    .string()
    .min(2, "Location is required")
    .max(255, "Location must not exceed 255 characters"),
  salary_min: z
    .number()
    .min(0, "Minimum salary must be positive")
    .refine((val) => val > 0, "Minimum salary is required"),
  salary_max: z
    .number()
    .min(0, "Maximum salary must be positive")
    .refine((val) => val > 0, "Maximum salary is required"),
  work_type: z.enum(["remote", "on_site"]),
  experience_level: z.enum([
    "entry_level",
    "mid_level",
    "senior_level",
    "executive_level",
  ]),
  deadline: z
    .string()
    .min(1, "Deadline is required")
    .refine(
      (date) => new Date(date) > new Date(),
      "Deadline must be in the future",
    ),
  category_id: z
    .number()
    .min(1, "Category is required")
    .int("Category must be a valid number"),
  skills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "Add at least one skill")
    .max(10, "Maximum 10 skills allowed"),
});

type JobListingFormData = z.infer<typeof jobListingSchema>;

// ─── Component ─────────────────────────────────────────────────────────────

export const NewJobList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.jobList);

  const [skillInput, setSkillInput] = useState("");
  const [categories] = useState([
    { id: 1, name: "Technology" },
    { id: 2, name: "Finance" },
    { id: 3, name: "Healthcare" },
    { id: 4, name: "Education" },
    { id: 5, name: "Marketing" },
    { id: 6, name: "Sales" },
    { id: 7, name: "Design" },
    { id: 8, name: "Operations" },
  ]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JobListingFormData>({
    resolver: zodResolver(jobListingSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      salary_min: 0,
      salary_max: 0,
      work_type: "remote",
      experience_level: "mid_level",
      deadline: "",
      category_id: 1,
      skills: [],
    },
  });

  const skills = watch("skills");

  // ── Handle Add Skill ────────────────────────────────────────────────
  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();

    // Validate
    if (!trimmedSkill) {
      return; // Empty input
    }

    if (skills.length >= 10) {
      return; // Max skills reached
    }

    // Check if skill already exists (case-insensitive)
    if (skills.some((s) => s.toLowerCase() === trimmedSkill.toLowerCase())) {
      setSkillInput("");
      return; // Skill already added
    }

    // Add skill to form
    const updatedSkills = [...skills, trimmedSkill];
    setValue("skills", updatedSkills);
    setSkillInput("");
  };

  // ── Handle Remove Skill ────────────────────────────────────────────
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setValue("skills", updatedSkills);
  };

  // ── Handle Form Submit ─────────────────────────────────────────────
  const onSubmit = async (data: JobListingFormData) => {
    try {
      // Dispatch create job listing
      const result = await dispatch(createJobListing(data)).unwrap();

      // Show success and redirect
      if (result) {
        navigate("/dashboard/employer/job-listings");
      }
    } catch (err) {
      // Error is already handled by the thunk
      console.error("Failed to create job listing:", err);
    }
  };

  // ── Handle Enter Key on Skill Input ────────────────────────────────
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BriefcaseIcon className="h-8 w-8" />
          Post New Job Listing
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Fill out the form below to create a new job posting
        </p>
      </div>

      {/* ── Error Message ─────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* ── Form ────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Provide all the necessary information about the job position
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ── Title ────────────────────────────────────────── */}
            <div>
              <Label htmlFor="title" className="font-semibold">
                Job Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Senior React Developer"
                {...register("title")}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* ── Description ──────────────────────────────────── */}
            <div>
              <Label htmlFor="description" className="font-semibold">
                Job Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and requirements..."
                {...register("description")}
                rows={8}
                className={errors.description ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 50 characters
              </p>
              {errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* ── Location & Work Type ──────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="font-semibold">
                  Location *
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  {...register("location")}
                  className={errors.location ? "border-destructive" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="work_type" className="font-semibold">
                  Work Type *
                </Label>
                <Controller
                  name="work_type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={errors.work_type ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="on_site">On-Site</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.work_type && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.work_type.message}
                  </p>
                )}
              </div>
            </div>

            {/* ── Salary Range ──────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary_min" className="font-semibold">
                  Minimum Salary ($) *
                </Label>
                <Input
                  id="salary_min"
                  type="number"
                  placeholder="e.g., 50000"
                  {...register("salary_min", { valueAsNumber: true })}
                  className={errors.salary_min ? "border-destructive" : ""}
                />
                {errors.salary_min && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.salary_min.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="salary_max" className="font-semibold">
                  Maximum Salary ($) *
                </Label>
                <Input
                  id="salary_max"
                  type="number"
                  placeholder="e.g., 120000"
                  {...register("salary_max", { valueAsNumber: true })}
                  className={errors.salary_max ? "border-destructive" : ""}
                />
                {errors.salary_max && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.salary_max.message}
                  </p>
                )}
              </div>
            </div>

            {/* ── Experience Level & Category ────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience_level" className="font-semibold">
                  Experience Level *
                </Label>
                <Controller
                  name="experience_level"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={
                          errors.experience_level ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry_level">Entry Level</SelectItem>
                        <SelectItem value="mid_level">Mid Level</SelectItem>
                        <SelectItem value="senior_level">
                          Senior Level
                        </SelectItem>
                        <SelectItem value="executive_level">
                          Executive Level
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.experience_level && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.experience_level.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category_id" className="font-semibold">
                  Category *
                </Label>
                <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value.toString()}
                      onValueChange={(val) => field.onChange(parseInt(val))}
                    >
                      <SelectTrigger
                        className={
                          errors.category_id ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category_id && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.category_id.message}
                  </p>
                )}
              </div>
            </div>

            {/* ── Deadline ────────────────────────────────────────── */}
            <div>
              <Label htmlFor="deadline" className="font-semibold">
                Application Deadline *
              </Label>
              <Input
                id="deadline"
                type="date"
                {...register("deadline")}
                className={errors.deadline ? "border-destructive" : ""}
              />
              {errors.deadline && (
                <p className="text-sm text-destructive mt-1">
                  {errors.deadline.message}
                </p>
              )}
            </div>

            {/* ── Skills ────────────────────────────────────────── */}
            <div>
              <Label className="font-semibold">
                Required Skills * ({skills.length}/10)
              </Label>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="e.g., React, TypeScript, Node.js"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={skills.length >= 10}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSkill}
                  disabled={!skillInput.trim() || skills.length >= 10}
                  className="gap-2 whitespace-nowrap"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {/* ── Skills Tags ────────────────────────────────────── */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 p-3 bg-muted rounded-lg">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="hover:opacity-70 transition-opacity"
                        title="Remove skill"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.skills && (
                <p className="text-sm text-destructive mt-1">
                  {errors.skills.message}
                </p>
              )}
            </div>

            {/* ── Submit Button ─────────────────────────────────── */}
            <div className="flex gap-3 pt-6 border-t">
              <Button type="submit" disabled={loading} className="gap-2">
                <BriefcaseIcon className="h-4 w-4" />
                {loading ? "Creating..." : "Post Job Listing"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/employer/job-listings")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
