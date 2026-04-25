import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  clearAuthError,
  registerThunk,
  selectAuth,
} from "@/app/auth/authSlice";

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    dispatch(clearAuthError());

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    try {
      await dispatch(
        registerThunk({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      ).unwrap();
      navigate("/complete-profile");
    } catch {
      // Error is stored in slice
    }
  }

  return (
    <div className="min-h-dvh grid place-items-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold tracking-tight">Register</h1>
          <p className="text-sm text-muted-foreground">
            Create your account to get started.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Name</span>
            <input
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Email</span>
            <input
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Password</span>
            <input
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Confirm Password</span>
            <input
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              type="password"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              minLength={6}
            />
          </label>

          {(error || auth.error) && (
            <p className="text-sm text-destructive" role="alert">
              {error ?? auth.error}
            </p>
          )}

          <Button className="w-full" type="submit" disabled={auth.isLoading}>
            {auth.isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="underline underline-offset-4" to="/auth/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
