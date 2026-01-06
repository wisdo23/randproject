import { FormEvent, useState } from "react";
import { useLocation, useNavigate, Link, type Location } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CredentialResponse, GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [attemptingGoogle, setAttemptingGoogle] = useState(false);
  const hasGoogle = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handleGoogleCredential = async (credentialResponse: CredentialResponse) => {
    if (attemptingGoogle) {
      return;
    }
    const credential = credentialResponse.credential;
    if (!credential) {
      toast({ title: "Google login failed", description: "Missing Google credential", variant: "destructive" });
      return;
    }
    try {
      setAttemptingGoogle(true);
      const response = await api.googleLogin({ idToken: credential });
      login(response.access_token);
      toast({ title: "Logged in", description: "Welcome back." });
      const redirectTo = (location.state as { from?: Location })?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google login failed";
      toast({ title: "Google login failed", description: message, variant: "destructive" });
    } finally {
      setAttemptingGoogle(false);
    }
  };

  useGoogleOneTapLogin({
    onSuccess: handleGoogleCredential,
    onError: () => {
      toast({ title: "Google login failed", description: "Could not authorize with Google", variant: "destructive" });
    },
    disabled: !hasGoogle,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const token = await api.login({ email, password });
      login(token.access_token);
      toast({ title: "Logged in", description: "Welcome back." });
      const redirectTo = (location.state as { from?: Location })?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast({ title: "Login failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-display text-center">Sign in to Rand Lottery</CardTitle>
          <CardDescription className="text-center">
            Use your manager credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          {hasGoogle && (
            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleCredential}
                onError={() => {
                  toast({ title: "Google login failed", description: "Could not authorize with Google", variant: "destructive" });
                  setAttemptingGoogle(false);
                }}
                text="continue_with"
                width="100%"
                locale="en"
              />
            </div>
          )}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Need an account? {" "}
            <Link to="/signup" className="text-primary underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
