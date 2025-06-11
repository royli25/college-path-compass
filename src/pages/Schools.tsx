import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, MapPin, Users, DollarSign, Star, BookOpen } from "lucide-react";
const Schools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const schools = [{
    id: 1,
    name: "Stanford University",
    location: "Stanford, CA",
    type: "reach",
    applicationType: "Common App",
    deadline: "Jan 5, 2024",
    status: "In Progress",
    acceptanceRate: "4%",
    tuition: "$56,169",
    major: "Computer Science",
    ranking: "#3 National Universities",
    logo: "🏛️"
  }, {
    id: 2,
    name: "UC Berkeley",
    location: "Berkeley, CA",
    type: "target",
    applicationType: "UC Application",
    deadline: "Nov 30, 2024",
    status: "Not Started",
    acceptanceRate: "17%",
    tuition: "$14,312",
    major: "Engineering",
    ranking: "#22 National Universities",
    logo: "🐻"
  }, {
    id: 3,
    name: "San Jose State University",
    location: "San Jose, CA",
    type: "safety",
    applicationType: "Cal State Apply",
    deadline: "Nov 30, 2024",
    status: "Submitted",
    acceptanceRate: "55%",
    tuition: "$7,852",
    major: "Computer Science",
    ranking: "#25 Regional Universities West",
    logo: "🏫"
  }];
  const getTypeColor = (type: string) => {
    switch (type) {
      case "reach":
        return "destructive";
      case "target":
        return "default";
      case "safety":
        return "secondary";
      default:
        return "outline";
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "In Progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Not Started":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };
  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) || school.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || school.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Group schools by type for display
  const groupedSchools = {
    reach: filteredSchools.filter(s => s.type === "reach"),
    target: filteredSchools.filter(s => s.type === "target"),
    safety: filteredSchools.filter(s => s.type === "safety")
  };
  return <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-medium text-foreground tracking-tight">School List</h1>
            <p className="text-lg text-muted-foreground">
              Research and organize your target colleges
            </p>
          </div>
          <Button className="rounded-xl bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="ultra-card">
          
        </Card>

        {/* School Lists by Type */}
        {["reach", "target", "safety"].map(type => {
        const typeSchools = groupedSchools[type as keyof typeof groupedSchools];
        if (typeSchools.length === 0) return null;
        return <div key={type} className="space-y-4">
              <h2 className="text-2xl font-medium text-foreground capitalize tracking-tight">
                {type} Schools ({typeSchools.length})
              </h2>
              <div className="space-y-4">
                {typeSchools.map(school => <Card key={school.id} className="ultra-card smooth-hover">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="text-3xl">{school.logo}</div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-medium text-foreground">{school.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{school.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3" />
                                    <span>{school.ranking}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={getTypeColor(school.type)} className="capitalize rounded-full">
                                  {school.type}
                                </Badge>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(school.status)}`}>
                                  {school.status}
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Accept Rate:</span>
                                <span className="text-foreground font-medium">{school.acceptanceRate}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Tuition:</span>
                                <span className="text-foreground font-medium">{school.tuition}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Major:</span>
                                <span className="text-foreground font-medium">{school.major}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">Deadline:</span>
                                <span className="text-foreground font-medium">{school.deadline}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl ml-4">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </div>;
      })}

        {filteredSchools.length === 0 && <Card className="ultra-card text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No schools found matching your criteria.</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
              <Button className="rounded-xl">Add Your First School</Button>
            </CardContent>
          </Card>}
      </div>
    </div>;
};
export default Schools;