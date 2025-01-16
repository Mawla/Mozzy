export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-8 bg-background rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-muted-foreground mb-4">
          There was an error verifying your email. This could be because:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-6">
          <li>The link has expired</li>
          <li>The link has already been used</li>
          <li>The link is invalid</li>
        </ul>
        <p className="text-muted-foreground">
          Please try signing in again to receive a new verification email.
        </p>
        <a
          href="/login"
          className="mt-6 inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Return to Login
        </a>
      </div>
    </div>
  );
}
