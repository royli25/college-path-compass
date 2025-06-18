
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useProfileData, useUpdateProfile } from "@/hooks/useProfileData";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Save, X, Plus } from "lucide-react";

interface AcademicFormProps {
  onNext: () => void;
  onBack: () => void;
}

const AcademicForm = ({ onNext, onBack }: AcademicFormProps) => {
  const { data: profile, isLoading } = useProfileData();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    gpa_unweighted: "",
    gpa_weighted: "",
    sat_act_score: "",
    ap_ib_courses: [] as string[],
    current_courses: [] as string[]
  });

  const [newApCourse, setNewApCourse] = useState("");
  const [newCurrentCourse, setNewCurrentCourse] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        gpa_unweighted: profile.gpa_unweighted?.toString() || "",
        gpa_weighted: profile.gpa_weighted?.toString() || "",
        sat_act_score: profile.sat_act_score || "",
        ap_ib_courses: profile.ap_ib_courses || [],
        current_courses: profile.current_courses || []
      });
    }
  }, [profile]);

  const addApCourse = () => {
    if (newApCourse.trim()) {
      setFormData({
        ...formData,
        ap_ib_courses: [...formData.ap_ib_courses, newApCourse.trim()]
      });
      setNewApCourse("");
    }
  };

  const removeApCourse = (index: number) => {
    setFormData({
      ...formData,
      ap_ib_courses: formData.ap_ib_courses.filter((_, i) => i !== index)
    });
  };

  const addCurrentCourse = () => {
    if (newCurrentCourse.trim()) {
      setFormData({
        ...formData,
        current_courses: [...formData.current_courses, newCurrentCourse.trim()]
      });
      setNewCurrentCourse("");
    }
  };

  const removeCurrentCourse = (index: number) => {
    setFormData({
      ...formData,
      current_courses: formData.current_courses.filter((_, i) => i !== index)
    });
  };

  const handleSave = async () => {
    try {
      const updateData = {
        ...formData,
        gpa_unweighted: formData.gpa_unweighted ? parseFloat(formData.gpa_unweighted) : null,
        gpa_weighted: formData.gpa_weighted ? parseFloat(formData.gpa_weighted) : null,
      };
      await updateProfile.mutateAsync(updateData);
      toast({
        title: "Academic information saved",
        description: "Your academic information has been updated successfully.",
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

  const isFormValid = formData.gpa_unweighted && formData.gpa_weighted && 
                     formData.sat_act_score && formData.ap_ib_courses.length > 0 && 
                     formData.current_courses.length > 0;

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Academic Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>GPA (Unweighted)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={formData.gpa_unweighted}
                onChange={(e) => setFormData({...formData, gpa_unweighted: e.target.value})}
                placeholder="e.g., 3.85"
              />
            </div>

            <div className="space-y-2">
              <Label>GPA (Weighted)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="5"
                value={formData.gpa_weighted}
                onChange={(e) => setFormData({...formData, gpa_weighted: e.target.value})}
                placeholder="e.g., 4.25"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>SAT/ACT Score</Label>
            <Input
              value={formData.sat_act_score}
              onChange={(e) => setFormData({...formData, sat_act_score: e.target.value})}
              placeholder="e.g., SAT: 1450 or ACT: 32"
            />
          </div>

          <div className="space-y-3">
            <Label>AP/IB Courses</Label>
            <div className="flex gap-2">
              <Input
                value={newApCourse}
                onChange={(e) => setNewApCourse(e.target.value)}
                placeholder="Add AP/IB course"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addApCourse())}
              />
              <Button type="button" onClick={addApCourse} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.ap_ib_courses.map((course, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {course}
                  <button
                    onClick={() => removeApCourse(index)}
                    className="ml-2 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Current Year Courses</Label>
            <div className="flex gap-2">
              <Input
                value={newCurrentCourse}
                onChange={(e) => setNewCurrentCourse(e.target.value)}
                placeholder="Add current course"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCurrentCourse())}
              />
              <Button type="button" onClick={addCurrentCourse} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.current_courses.map((course, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {course}
                  <button
                    onClick={() => removeCurrentCourse(index)}
                    className="ml-2 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
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

export default AcademicForm;
