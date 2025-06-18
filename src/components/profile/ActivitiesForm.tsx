
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useProfileData, useUpdateProfile } from "@/hooks/useProfileData";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Save, X, Plus, Edit } from "lucide-react";

interface Activity {
  name: string;
  description: string;
  position?: string;
  yearsInvolved?: number;
}

interface ActivitiesFormProps {
  onNext: () => void;
  onBack: () => void;
}

const ActivitiesForm = ({ onNext, onBack }: ActivitiesFormProps) => {
  const { data: profile, isLoading } = useProfileData();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [leadershipPositions, setLeadershipPositions] = useState<string[]>([]);
  const [yearsInvolved, setYearsInvolved] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [editingActivity, setEditingActivity] = useState<number | null>(null);
  const [activityForm, setActivityForm] = useState({
    name: "",
    description: "",
    position: "",
    yearsInvolved: ""
  });

  useEffect(() => {
    if (profile) {
      setActivities(profile.activities || []);
      setLeadershipPositions(profile.leadership_positions || []);
      setYearsInvolved(profile.years_involved?.toString() || "");
    }
  }, [profile]);

  const addActivity = () => {
    if (activityForm.name.trim() && activityForm.description.trim()) {
      const newActivity: Activity = {
        name: activityForm.name.trim(),
        description: activityForm.description.trim(),
        position: activityForm.position.trim() || undefined,
        yearsInvolved: activityForm.yearsInvolved ? parseInt(activityForm.yearsInvolved) : undefined
      };

      if (editingActivity !== null) {
        const updatedActivities = [...activities];
        updatedActivities[editingActivity] = newActivity;
        setActivities(updatedActivities);
        setEditingActivity(null);
      } else {
        setActivities([...activities, newActivity]);
      }

      setActivityForm({ name: "", description: "", position: "", yearsInvolved: "" });
    }
  };

  const editActivity = (index: number) => {
    const activity = activities[index];
    setActivityForm({
      name: activity.name,
      description: activity.description,
      position: activity.position || "",
      yearsInvolved: activity.yearsInvolved?.toString() || ""
    });
    setEditingActivity(index);
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const addLeadershipPosition = () => {
    if (newPosition.trim()) {
      setLeadershipPositions([...leadershipPositions, newPosition.trim()]);
      setNewPosition("");
    }
  };

  const removeLeadershipPosition = (index: number) => {
    setLeadershipPositions(leadershipPositions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const updateData = {
        activities,
        leadership_positions: leadershipPositions,
        years_involved: yearsInvolved ? parseInt(yearsInvolved) : null
      };
      await updateProfile.mutateAsync(updateData);
      toast({
        title: "Activities information saved",
        description: "Your activities and leadership information has been updated successfully.",
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

  const isFormValid = activities.length > 0 && leadershipPositions.length > 0 && yearsInvolved;

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Activities & Leadership</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Extracurricular Activities (up to 10)</Label>
            
            {/* Activity Form */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  value={activityForm.name}
                  onChange={(e) => setActivityForm({...activityForm, name: e.target.value})}
                  placeholder="Activity name"
                />
                <Input
                  value={activityForm.position}
                  onChange={(e) => setActivityForm({...activityForm, position: e.target.value})}
                  placeholder="Position/Role (optional)"
                />
              </div>
              <Input
                type="number"
                min="1"
                max="4"
                value={activityForm.yearsInvolved}
                onChange={(e) => setActivityForm({...activityForm, yearsInvolved: e.target.value})}
                placeholder="Years involved"
              />
              <Textarea
                value={activityForm.description}
                onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
                placeholder="Description (150 characters max)"
                maxLength={150}
                rows={3}
              />
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  onClick={addActivity}
                  disabled={!activityForm.name.trim() || !activityForm.description.trim() || activities.length >= 10}
                >
                  {editingActivity !== null ? "Update Activity" : "Add Activity"}
                </Button>
                {editingActivity !== null && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setEditingActivity(null);
                      setActivityForm({ name: "", description: "", position: "", yearsInvolved: "" });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-2">
              {activities.map((activity, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{activity.name}</h4>
                        {activity.position && (
                          <Badge variant="outline">{activity.position}</Badge>
                        )}
                        {activity.yearsInvolved && (
                          <Badge variant="secondary">{activity.yearsInvolved} years</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => editActivity(index)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removeActivity(index)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Leadership Positions</Label>
            <div className="flex gap-2">
              <Input
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                placeholder="Add leadership position"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLeadershipPosition())}
              />
              <Button type="button" onClick={addLeadershipPosition} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {leadershipPositions.map((position, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {position}
                  <button
                    onClick={() => removeLeadershipPosition(index)}
                    className="ml-2 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Total Years Involved in Activities</Label>
            <Input
              type="number"
              min="1"
              max="4"
              value={yearsInvolved}
              onChange={(e) => setYearsInvolved(e.target.value)}
              placeholder="e.g., 3"
            />
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

export default ActivitiesForm;
