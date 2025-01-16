export default function CheckEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-8 bg-background rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p className="text-muted-foreground mb-4">
          We&apos;ve sent you an email with a link to confirm your account.
        </p>
        <p className="text-muted-foreground">
          Please check your email and click the link to complete your
          registration.
        </p>
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive an email?
          </p>
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Try signing up again
          </a>
        </div>
      </div>
    </div>
  );
}
