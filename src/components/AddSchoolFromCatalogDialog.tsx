import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, MapPin } from "lucide-react";
import { useSchoolsCatalog, useAddSchoolToList } from "@/hooks/useSchools";
import { ScrollArea } from "@/components/ui/scroll-area";

const AddSchoolFromCatalogDialog = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [major, setMajor] = useState("");
  const [deadline, setDeadline] = useState("");

  const { data: schoolsCatalog = [], isLoading } = useSchoolsCatalog();
  const addSchoolMutation = useAddSchoolToList();

  const filteredSchools = schoolsCatalog.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.location && school.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddSchool = () => {
    if (!selectedSchool) return;

    addSchoolMutation.mutate({
      schoolId: selectedSchool.id,
      major: major || undefined,
      applicationDeadline: deadline || undefined
    }, {
      onSuccess: () => {
        setSelectedSchool(null);
        setMajor("");
        setDeadline("");
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add School to My List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add School to Your List</DialogTitle>
        </DialogHeader>
        
        {!selectedSchool ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {isLoading ? (
                  <p className="text-center text-muted-foreground">Loading schools...</p>
                ) : filteredSchools.length === 0 ? (
                  <p className="text-center text-muted-foreground">No schools found</p>
                ) : (
                  filteredSchools.map((school) => (
                    <div
                      key={school.id}
                      onClick={() => setSelectedSchool(school)}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{school.name}</h3>
                          {school.location && (
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {school.location}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {school.acceptance_rate && (
                              <span className="text-xs text-muted-foreground">
                                {school.acceptance_rate} acceptance
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/20">
              <h3 className="font-medium">{selectedSchool.name}</h3>
              {selectedSchool.location && (
                <p className="text-sm text-muted-foreground">{selectedSchool.location}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="major">Intended Major (optional)</Label>
              <Input
                id="major"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g., Computer Science"
              />
            </div>

            <div>
              <Label htmlFor="deadline">Application Deadline (optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setSelectedSchool(null)}
              >
                Back
              </Button>
              <Button 
                onClick={handleAddSchool}
                disabled={addSchoolMutation.isPending}
              >
                {addSchoolMutation.isPending ? "Adding..." : "Add to My List"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddSchoolFromCatalogDialog;
