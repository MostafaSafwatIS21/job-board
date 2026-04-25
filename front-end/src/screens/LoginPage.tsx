import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearAuthError, loginThunk, selectAuth } from "@/app/auth/authSlice";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    dispatch(clearAuthError());
    try {
      const result = await dispatch(loginThunk({ email, password })).unwrap();
      console.log(result);
      if (result.user.completed_profile) {
        navigate("/");
        return;
      }
      navigate("/complete-profile");
    } catch {
      // Error is stored in slice
    }
  }

  return (
    <div className="min-h-dvh grid place-items-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground">
            Use your email and password.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          {auth.error && (
            <p className="text-sm text-destructive" role="alert">
              {auth.error}
            </p>
          )}

          <Button className="w-full" type="submit" disabled={auth.isLoading}>
            {auth.isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          No account?{" "}
          <Link className="underline underline-offset-4" to="/auth/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
