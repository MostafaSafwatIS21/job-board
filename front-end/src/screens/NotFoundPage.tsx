import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Not Found</h1>
      <p className="text-sm text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link className="text-sm underline underline-offset-4" to="/">
        Go home
      </Link>
    </section>
  );
}
