
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useCreateSchool } from "@/hooks/useSchools";

const AddSchoolDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "",
    application_type: "",
    deadline: "",
    acceptance_rate: "",
    tuition: "",
    major: "",
    ranking: ""
  });

  const createSchoolMutation = useCreateSchool();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    createSchoolMutation.mutate({
      name: formData.name,
      location: formData.location || null,
      type: formData.type || null,
      application_type: formData.application_type || null,
      deadline: formData.deadline || null,
      status: "Not Started",
      acceptance_rate: formData.acceptance_rate || null,
      tuition: formData.tuition || null,
      major: formData.major || null,
      ranking: formData.ranking || null
    }, {
      onSuccess: () => {
        setFormData({
          name: "",
          location: "",
          type: "",
          application_type: "",
          deadline: "",
          acceptance_rate: "",
          tuition: "",
          major: "",
          ranking: ""
        });
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add School
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New School</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">School Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter school name"
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, State"
            />
          </div>

          <div>
            <Label htmlFor="type">School Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reach">Reach</SelectItem>
                <SelectItem value="target">Target</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="major">Intended Major</Label>
            <Input
              id="major"
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              placeholder="e.g., Computer Science"
            />
          </div>

          <div>
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="acceptance_rate">Acceptance Rate</Label>
              <Input
                id="acceptance_rate"
                value={formData.acceptance_rate}
                onChange={(e) => setFormData({ ...formData, acceptance_rate: e.target.value })}
                placeholder="e.g., 15%"
              />
            </div>
            <div>
              <Label htmlFor="tuition">Tuition</Label>
              <Input
                id="tuition"
                value={formData.tuition}
                onChange={(e) => setFormData({ ...formData, tuition: e.target.value })}
                placeholder="e.g., $50,000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ranking">Ranking</Label>
            <Input
              id="ranking"
              value={formData.ranking}
              onChange={(e) => setFormData({ ...formData, ranking: e.target.value })}
              placeholder="e.g., #25 National Universities"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createSchoolMutation.isPending}>
              {createSchoolMutation.isPending ? "Adding..." : "Add School"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSchoolDialog;
