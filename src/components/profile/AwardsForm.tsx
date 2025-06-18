
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useProfileData, useUpdateProfile } from "@/hooks/useProfileData";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, X, Plus, Edit } from "lucide-react";

interface Award {
  name: string;
  description: string;
  level: string;
}

interface AwardsFormProps {
  onNext: () => void;
  onBack: () => void;
}

const AwardsForm = ({ onNext, onBack }: AwardsFormProps) => {
  const { data: profile, isLoading } = useProfileData();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const [awards, setAwards] = useState<Award[]>([]);
  const [achievementLevels, setAchievementLevels] = useState<string[]>([]);
  const [editingAward, setEditingAward] = useState<number | null>(null);
  const [awardForm, setAwardForm] = useState({
    name: "",
    description: "",
    level: ""
  });

  useEffect(() => {
    if (profile) {
      setAwards(profile.honors_awards || []);
      setAchievementLevels(profile.achievement_levels || []);
    }
  }, [profile]);

  const addAward = () => {
    if (awardForm.name.trim() && awardForm.description.trim() && awardForm.level) {
      const newAward: Award = {
        name: awardForm.name.trim(),
        description: awardForm.description.trim(),
        level: awardForm.level
      };

      if (editingAward !== null) {
        const updatedAwards = [...awards];
        updatedAwards[editingAward] = newAward;
        setAwards(updatedAwards);
        setEditingAward(null);
      } else {
        setAwards([...awards, newAward]);
      }

      // Add level to achievement levels if not already there
      if (!achievementLevels.includes(awardForm.level)) {
        setAchievementLevels([...achievementLevels, awardForm.level]);
      }

      setAwardForm({ name: "", description: "", level: "" });
    }
  };

  const editAward = (index: number) => {
    const award = awards[index];
    setAwardForm({
      name: award.name,
      description: award.description,
      level: award.level
    });
    setEditingAward(index);
  };

  const removeAward = (index: number) => {
    const removedAward = awards[index];
    setAwards(awards.filter((_, i) => i !== index));

    // Remove level from achievement levels if no other awards have this level
    const remainingAwards = awards.filter((_, i) => i !== index);
    const hasOtherAwardsWithLevel = remainingAwards.some(award => award.level === removedAward.level);
    if (!hasOtherAwardsWithLevel) {
      setAchievementLevels(achievementLevels.filter(level => level !== removedAward.level));
    }
  };

  const handleSave = async () => {
    try {
      const updateData = {
        honors_awards: awards,
        achievement_levels: achievementLevels
      };
      await updateProfile.mutateAsync(updateData);
      toast({
        title: "Awards information saved",
        description: "Your honors and awards information has been updated successfully.",
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

  const isFormValid = awards.length > 0 && achievementLevels.length > 0;

  const achievementLevelOptions = [
    "School Level",
    "Regional Level",
    "State Level",
    "National Level",
    "International Level"
  ];

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Honors & Awards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Honors & Awards (up to 5)</Label>
            
            {/* Award Form */}
            <div className="border rounded-lg p-4 space-y-3">
              <Input
                value={awardForm.name}
                onChange={(e) => setAwardForm({...awardForm, name: e.target.value})}
                placeholder="Award/Honor name"
              />
              <Select value={awardForm.level} onValueChange={(value) => setAwardForm({...awardForm, level: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select achievement level" />
                </SelectTrigger>
                <SelectContent>
                  {achievementLevelOptions.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={awardForm.description}
                onChange={(e) => setAwardForm({...awardForm, description: e.target.value})}
                placeholder="Description of the award/honor"
                rows={3}
              />
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  onClick={addAward}
                  disabled={!awardForm.name.trim() || !awardForm.description.trim() || !awardForm.level || awards.length >= 5}
                >
                  {editingAward !== null ? "Update Award" : "Add Award"}
                </Button>
                {editingAward !== null && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setEditingAward(null);
                      setAwardForm({ name: "", description: "", level: "" });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {/* Awards List */}
            <div className="space-y-2">
              {awards.map((award, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{award.name}</h4>
                        <Badge variant="outline">{award.level}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{award.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => editAward(index)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removeAward(index)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {achievementLevels.length > 0 && (
            <div className="space-y-2">
              <Label>Achievement Levels</Label>
              <div className="flex flex-wrap gap-2">
                {achievementLevels.map((level, index) => (
                  <Badge key={index} variant="secondary">
                    {level}
                  </Badge>
                ))}
              </div>
            </div>
          )}
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
            Complete Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AwardsForm;
