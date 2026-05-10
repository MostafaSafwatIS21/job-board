import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { getApiErrorMessage } from "@/utils/api";
import { createApplication } from "@/app/application/appSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";

const formSchema = z.object({
  cover_letter: z
    .string()
    .min(100, "Cover letter must be at least 100 characters."),
  links: z.array(
    z.object({
      url: z.string().url("Enter a valid URL").or(z.literal("")),
    }),
  ),
});

type ApplicationFormValues = z.infer<typeof formSchema>;

type ApplicationFormProps = {
  jobId: number;
};

export default function ApplicationForm({ jobId }: ApplicationFormProps) {
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cover_letter: "",
      links: [{ url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray<
    ApplicationFormValues,
    "links"
  >({
    control: form.control,
    name: "links",
  });
  const dispatch = useDispatch<AppDispatch>();

  async function onSubmit(data: ApplicationFormValues) {
    try {
      const links = data.links.map((link) => link.url.trim()).filter(Boolean);

      const app = dispatch(
        createApplication({
          jobId,
          cover_letter: data.cover_letter.trim(),
          links,
        }),
      );

      console.log(app);

      toast.success("Application submitted", {
        description: "Your application has been sent to the employer.",
      });

      form.reset({ cover_letter: "", links: [{ url: "" }] });
    } catch (error) {
      toast.error(getApiErrorMessage(error), {
        description: "Please review your application and try again.",
      });
    }
  }

  return (
    <Card className="w-full sm:max-w-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Apply for this role</CardTitle>
        <CardDescription className="text-lg">
          Introduce yourself and share relevant links.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="cover_letter"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-rhf-demo-cover-letter"
                    className="text-lg"
                  >
                    Cover Letter
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-demo-cover-letter"
                      placeholder="Share your experience, strengths, and why you're a great fit."
                      rows={8}
                      className="min-h-32 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length} characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Minimum 100 characters. Include relevant experience and
                    skills.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FieldLabel className="text-lg">Links</FieldLabel>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ url: "" })}
                >
                  Add link
                </Button>
              </div>
              {fields.map((fieldItem, index) => (
                <Controller
                  key={fieldItem.id}
                  name={`links.${index}.url`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center gap-2">
                        <Input
                          {...field}
                          placeholder="https://linkedin.com/in/..."
                          aria-invalid={fieldState.invalid}
                        />
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ))}
              <FieldDescription>
                Add links to your portfolio, LinkedIn, or resume.
              </FieldDescription>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
