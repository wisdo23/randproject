import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CredentialResponse, GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [attemptingGoogle, setAttemptingGoogle] = useState(false);

  const hasGoogle = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handleGoogleCredential = async (credentialResponse: CredentialResponse) => {
    if (attemptingGoogle) {
      return;
    }
    const credential = credentialResponse.credential;
    if (!credential) {
      toast({ title: "Google signup failed", description: "Missing Google credential", variant: "destructive" });
      return;
    }
    try {
      setAttemptingGoogle(true);
      const response = await api.googleLogin({ idToken: credential });
      login(response.access_token);
      toast({ title: "Account created", description: "You are now signed in." });
      navigate("/", { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google signup failed";
      toast({ title: "Google signup failed", description: message, variant: "destructive" });
    } finally {
      setAttemptingGoogle(false);
    }
  };

  useGoogleOneTapLogin({
    onSuccess: handleGoogleCredential,
    onError: () => {
      toast({ title: "Google signup failed", description: "Could not authorize with Google", variant: "destructive" });
    },
    disabled: !hasGoogle,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const token = await api.signup({ email, password, phone: phone || undefined });
      login(token.access_token);
      toast({ title: "Account created", description: "You are now signed in." });
      navigate("/", { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      toast({ title: "Signup failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-display text-center">Create a manager account</CardTitle>
          <CardDescription className="text-center">
            Register your email to start managing draw results.
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
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">Use at least 6 characters.</p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>
          {hasGoogle && (
            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleCredential}
                onError={() => {
                  toast({ title: "Google signup failed", description: "Could not authorize with Google", variant: "destructive" });
                  setAttemptingGoogle(false);
                }}
                text="continue_with"
                width="100%"
                locale="en"
              />
            </div>
          )}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? {" "}
            <Link to="/login" className="text-primary underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
