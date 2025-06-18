
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useSchoolsCatalog, useCreateSchoolInCatalog } from "@/hooks/useSchools";
import { useToast } from "@/hooks/use-toast";

const AdminSchools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: "",
    location: "",
    type: "",
    acceptance_rate: "",
    tuition: "",
    ranking: ""
  });

  const { data: schools = [], isLoading, error } = useSchoolsCatalog();
  const createSchoolMutation = useCreateSchoolInCatalog();
  const { toast } = useToast();

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.location && school.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddSchool = async () => {
    if (!newSchool.name.trim()) {
      toast({
        title: "Error",
        description: "School name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await createSchoolMutation.mutateAsync(newSchool);
      toast({
        title: "Success",
        description: "School added to catalog successfully"
      });
      setNewSchool({
        name: "",
        location: "",
        type: "",
        acceptance_rate: "",
        tuition: "",
        ranking: ""
      });
      setIsAddingSchool(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add school to catalog",
        variant: "destructive"
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="ultra-card text-center py-12">
            <CardContent>
              <p className="text-lg text-destructive mb-4">Error loading schools catalog</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-medium text-foreground tracking-tight">
              Schools Catalog Management
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage the master list of schools available to students
            </p>
          </div>
          <Button onClick={() => setIsAddingSchool(true)} className="rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
        </div>

        {/* Search */}
        <Card className="ultra-card">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Add School Form */}
        {isAddingSchool && (
          <Card className="ultra-card">
            <CardHeader>
              <CardTitle>Add New School</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="School Name *"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                />
                <Input
                  placeholder="Location"
                  value={newSchool.location}
                  onChange={(e) => setNewSchool({...newSchool, location: e.target.value})}
                />
                <Input
                  placeholder="Type (reach/target/safety)"
                  value={newSchool.type}
                  onChange={(e) => setNewSchool({...newSchool, type: e.target.value})}
                />
                <Input
                  placeholder="Acceptance Rate"
                  value={newSchool.acceptance_rate}
                  onChange={(e) => setNewSchool({...newSchool, acceptance_rate: e.target.value})}
                />
                <Input
                  placeholder="Tuition"
                  value={newSchool.tuition}
                  onChange={(e) => setNewSchool({...newSchool, tuition: e.target.value})}
                />
                <Input
                  placeholder="Ranking"
                  value={newSchool.ranking}
                  onChange={(e) => setNewSchool({...newSchool, ranking: e.target.value})}
                />
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleAddSchool} disabled={createSchoolMutation.isPending}>
                  {createSchoolMutation.isPending ? "Adding..." : "Add School"}
                </Button>
                <Button variant="outline" onClick={() => setIsAddingSchool(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="ultra-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Schools List */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredSchools.map(school => (
              <Card key={school.id} className="ultra-card smooth-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-medium text-foreground">{school.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{school.location}</p>
                        </div>
                        {school.type && (
                          <Badge variant="outline" className="capitalize rounded-full">
                            {school.type}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        {school.acceptance_rate && (
                          <div>
                            <span className="text-muted-foreground">Accept Rate:</span>
                            <span className="text-foreground font-medium ml-2">{school.acceptance_rate}</span>
                          </div>
                        )}
                        {school.tuition && (
                          <div>
                            <span className="text-muted-foreground">Tuition:</span>
                            <span className="text-foreground font-medium ml-2">{school.tuition}</span>
                          </div>
                        )}
                        {school.ranking && (
                          <div>
                            <span className="text-muted-foreground">Ranking:</span>
                            <span className="text-foreground font-medium ml-2">{school.ranking}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredSchools.length === 0 && (
          <Card className="ultra-card text-center py-12">
            <CardContent>
              <p className="text-lg text-muted-foreground mb-4">No schools found matching your criteria.</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or add a new school to the catalog.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminSchools;
