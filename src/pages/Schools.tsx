
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import { Search, Plus, MapPin, Users, DollarSign, Star } from "lucide-react";

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const schools = [
    {
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
      logo: "🏛️"
    },
    {
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
      logo: "🐻"
    },
    {
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
      logo: "🏫"
    },
    {
      id: 4,
      name: "MIT",
      location: "Cambridge, MA",
      type: "reach",
      applicationType: "MIT Application",
      deadline: "Jan 1, 2024",
      status: "Not Started",
      acceptanceRate: "7%",
      tuition: "$53,450",
      major: "Computer Science",
      logo: "🔬"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "reach": return "destructive";
      case "target": return "default";
      case "safety": return "secondary";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Not Started": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || school.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My School List</h1>
            <p className="text-muted-foreground">
              Manage your college applications and track your progress
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add School</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schools by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              <SelectItem value="reach">Reach Schools</SelectItem>
              <SelectItem value="target">Target Schools</SelectItem>
              <SelectItem value="safety">Safety Schools</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* School Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <Card key={school.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{school.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{school.name}</CardTitle>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{school.location}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={getTypeColor(school.type)} className="capitalize">
                    {school.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{school.acceptanceRate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{school.tuition}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Major:</span>
                    <span className="font-medium">{school.major}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Application:</span>
                    <span className="font-medium">{school.applicationType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="font-medium">{school.deadline}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(school.status)}`}>
                    {school.status}
                  </span>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSchools.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No schools found matching your criteria.</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
              <Button>Add Your First School</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Schools;
