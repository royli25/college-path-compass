import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bell, Shield, User, Palette, LogOut, Save } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useBeforeUnload } from "react-router-dom";
import { useProfileData, useUpdateProfile } from "@/hooks/useProfileData";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const { data: profile, isLoading } = useProfileData();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [isDirty, setIsDirty] = useState(false);

  // Background Information State
  const [backgroundData, setBackgroundData] = useState({
    gender: "",
    citizenship: "",
    race_ethnicity: "",
    first_generation: null as boolean | null,
    income_bracket: ""
  });

  useEffect(() => {
    setIsDirty(currentTheme !== theme);
  }, [currentTheme, theme]);

  useEffect(() => {
    if (profile) {
      setBackgroundData({
        gender: profile.gender || "",
        citizenship: profile.citizenship || "",
        race_ethnicity: profile.race_ethnicity || "",
        first_generation: profile.first_generation,
        income_bracket: profile.income_bracket || ""
      });
    }
  }, [profile]);

  useBeforeUnload(
    (event) => {
      if (isDirty) {
        event.preventDefault();
      }
    },
    { capture: true }
  );

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSave = () => {
    if (currentTheme) {
      setTheme(currentTheme);
      setIsDirty(false);
    }
  };

  const handleSaveBackground = async () => {
    try {
      await updateProfile.mutateAsync(backgroundData);
      toast({
        title: "Background information saved",
        description: "Your background information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving data",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const isBackgroundComplete = backgroundData.gender && backgroundData.citizenship && 
                             backgroundData.race_ethnicity && backgroundData.first_generation !== null && 
                             backgroundData.income_bracket;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Background Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Background Information
            </CardTitle>
            <CardDescription>
              Your personal and demographic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={backgroundData.gender} onValueChange={(value) => setBackgroundData({...backgroundData, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Citizenship</Label>
                <Select value={backgroundData.citizenship} onValueChange={(value) => setBackgroundData({...backgroundData, citizenship: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select citizenship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-citizen">U.S. Citizen</SelectItem>
                    <SelectItem value="permanent-resident">Permanent Resident</SelectItem>
                    <SelectItem value="international">International Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Race/Ethnicity</Label>
              <Select value={backgroundData.race_ethnicity} onValueChange={(value) => setBackgroundData({...backgroundData, race_ethnicity: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select race/ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="american-indian">American Indian or Alaska Native</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="black">Black or African American</SelectItem>
                  <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                  <SelectItem value="pacific-islander">Native Hawaiian or Pacific Islander</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="two-or-more">Two or more races</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Are you a first-generation college student?</Label>
              <RadioGroup 
                value={backgroundData.first_generation?.toString() || ""} 
                onValueChange={(value) => setBackgroundData({...backgroundData, first_generation: value === "true"})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="first-gen-yes" />
                  <Label htmlFor="first-gen-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="first-gen-no" />
                  <Label htmlFor="first-gen-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Family Income Bracket</Label>
              <Select value={backgroundData.income_bracket} onValueChange={(value) => setBackgroundData({...backgroundData, income_bracket: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select income bracket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-30k">Under $30,000</SelectItem>
                  <SelectItem value="30k-60k">$30,000 - $60,000</SelectItem>
                  <SelectItem value="60k-100k">$60,000 - $100,000</SelectItem>
                  <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
                  <SelectItem value="150k-250k">$150,000 - $250,000</SelectItem>
                  <SelectItem value="over-250k">Over $250,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSaveBackground} disabled={!isBackgroundComplete || updateProfile.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Save Background Information
            </Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter your first name" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter your last name" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch id="emailNotifications" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="applicationUpdates">Application Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about application deadlines and updates
                </p>
              </div>
              <Switch id="applicationUpdates" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="schoolUpdates">School Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about schools you're interested in
                </p>
              </div>
              <Switch id="schoolUpdates" />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Manage your privacy and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="profileVisibility">Make Profile Public</Label>
                <p className="text-sm text-muted-foreground">
                  Allow other users to view your profile
                </p>
              </div>
              <Switch id="profileVisibility" />
            </div>
            <Separator />
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" placeholder="Enter current password" />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" placeholder="Enter new password" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
            </div>
            <Button variant="outline">Update Password</Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch to dark theme
                </p>
              </div>
              <Switch 
                id="darkMode" 
                checked={currentTheme === "dark"}
                onCheckedChange={(checked) => setCurrentTheme(checked ? "dark" : "light")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Account
            </CardTitle>
            <CardDescription>
              Manage your account and session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label>Sign Out</Label>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {isDirty && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-end items-center shadow-lg">
          <p className="text-sm text-muted-foreground mr-4">You have unsaved changes.</p>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      )}
    </div>
  );
};

export default Settings;
