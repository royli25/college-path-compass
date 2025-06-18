
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProfileData, useUpdateProfile, ProfileData } from "@/hooks/useProfileData";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

interface BackgroundFormProps {
  onNext: () => void;
  onBack: () => void;
}

const BackgroundForm = ({ onNext, onBack }: BackgroundFormProps) => {
  const { data: profile, isLoading } = useProfileData();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    gender: "",
    citizenship: "",
    race_ethnicity: "",
    first_generation: null as boolean | null,
    income_bracket: "",
    high_school: "",
    class_rank: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        gender: profile.gender || "",
        citizenship: profile.citizenship || "",
        race_ethnicity: profile.race_ethnicity || "",
        first_generation: profile.first_generation,
        income_bracket: profile.income_bracket || "",
        high_school: profile.high_school || "",
        class_rank: profile.class_rank || ""
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData);
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

  const handleNext = async () => {
    await handleSave();
    onNext();
  };

  const isFormValid = formData.gender && formData.citizenship && formData.race_ethnicity && 
                     formData.first_generation !== null && formData.income_bracket && 
                     formData.high_school && formData.class_rank;

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Background Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
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
              <Select value={formData.citizenship} onValueChange={(value) => setFormData({...formData, citizenship: value})}>
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
            <Select value={formData.race_ethnicity} onValueChange={(value) => setFormData({...formData, race_ethnicity: value})}>
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
              value={formData.first_generation?.toString() || ""} 
              onValueChange={(value) => setFormData({...formData, first_generation: value === "true"})}
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
            <Select value={formData.income_bracket} onValueChange={(value) => setFormData({...formData, income_bracket: value})}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>High School</Label>
              <Input
                value={formData.high_school}
                onChange={(e) => setFormData({...formData, high_school: e.target.value})}
                placeholder="Enter your high school name"
              />
            </div>

            <div className="space-y-2">
              <Label>Class Rank</Label>
              <Input
                value={formData.class_rank}
                onChange={(e) => setFormData({...formData, class_rank: e.target.value})}
                placeholder="e.g., 15/300 or Top 10%"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleSave} disabled={updateProfile.isPending}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={handleNext} disabled={!isFormValid || updateProfile.isPending}>
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundForm;
