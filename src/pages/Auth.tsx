import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GraduationCap, Mail, Lock, User, ArrowLeft, AlertCircle, Users } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({ 
    fullName: "", 
    email: "", 
    password: "",
    role: "student" as "student" | "advisor"
  });

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSigningIn(true);
    
    const { error } = await signIn(signInData.email, signInData.password);
    
    if (error) {
      setError(error.message || 'Failed to sign in');
    }
    
    setIsSigningIn(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSigningUp(true);
    
    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.fullName, signUpData.role);
    
    if (error) {
      setError(error.message || 'Failed to create account');
    } else {
      setSuccess('Account created successfully! Please check your email to verify your account.');
      setSignUpData({ fullName: "", email: "", password: "", role: "student" });
    }
    
    setIsSigningUp(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
          <div className="flex justify-center mb-4">
            <img src="/myblueprint.png" alt="MyBlueprint Logo" className="h-10 mx-auto mb-4 block dark:hidden" />
            <img src="/myblueprint_dark.png" alt="MyBlueprint Logo" className="h-10 mx-auto mb-4 hidden dark:block" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Welcome</h1>
          <p className="text-muted-foreground mt-2">Start organizing your college applications today</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-lg">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@email.com"
                        className="pl-10"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSigningIn}>
                    {isSigningIn ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        className="pl-10"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="student@email.com"
                        className="pl-10"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="role">Account Type</Label>
                    <RadioGroup
                      value={signUpData.role}
                      onValueChange={(value) => setSignUpData({ ...signUpData, role: value as "student" | "advisor" })}
                      className="grid grid-cols-1 gap-3"
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="student" id="student" />
                        <div className="flex items-center space-x-2 flex-1">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          <div>
                            <Label htmlFor="student" className="font-medium cursor-pointer">
                              Student
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Track applications and get guidance
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="advisor" id="advisor" />
                        <div className="flex items-center space-x-2 flex-1">
                          <Users className="h-5 w-5 text-primary" />
                          <div>
                            <Label htmlFor="advisor" className="font-medium cursor-pointer">
                              Advisor
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Guide and mentor students
                            </p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSigningUp}>
                    {isSigningUp ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
