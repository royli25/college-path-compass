import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, GraduationCap, MapPin, Trophy, BookOpen, FileText } from "lucide-react";
import { useAdmittedProfiles } from "@/hooks/useAdmittedProfiles";
import { Link } from "react-router-dom";

const AdmittedProfiles = () => {
  const { data: profiles = [], isLoading } = useAdmittedProfiles();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.high_school.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.intended_major?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.colleges_admitted?.some((college: any) => 
                           college.school?.toLowerCase().includes(searchTerm.toLowerCase())
                         );

    if (selectedCategory === "all") return matchesSearch;
    
    // Add category filtering logic here based on major, GPA ranges, etc.
    return matchesSearch;
  });

  const categories = [
    { id: "all", label: "All Profiles", count: profiles.length },
    { id: "stem", label: "STEM", count: profiles.filter(p => p.intended_major?.toLowerCase().includes("computer") || p.intended_major?.toLowerCase().includes("engineering")).length },
    { id: "liberal-arts", label: "Liberal Arts", count: profiles.filter(p => p.intended_major?.toLowerCase().includes("policy") || p.intended_major?.toLowerCase().includes("government")).length },
    { id: "high-achievers", label: "High Achievers", count: profiles.filter(p => (p.gpa_unweighted || 0) >= 3.9).length },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Admitted Profiles</h1>
        <p className="text-muted-foreground">
          Explore profiles of students who have been admitted to top universities.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search profiles, schools, or majors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.label}
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Profiles Grid */}
      {filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProfiles.map((profile) => (
            <Link key={profile.id} to={`/resources/admitted-profiles/${profile.id}`}>
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-4 flex-grow">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base font-semibold mb-0.5">{profile.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Class of {profile.graduation_year}</p>
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="flex items-center gap-3 mb-3">
                    {profile.intended_major && (
                      <Badge variant="secondary" className="w-fit text-xs px-3 py-1">
                        {profile.intended_major}
                      </Badge>
                    )}
                    <Badge 
                      variant={profile.essay_excerpts?.length ? "outline" : "secondary"} 
                      className="flex items-center gap-1 text-xs px-3 py-1"
                    >
                      <FileText className="h-3 w-3" />
                      {profile.essay_excerpts?.length || 0} Essays
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 flex flex-col flex-grow">
                  <div className="flex flex-col flex-grow justify-between">
                    {/* Academic Stats */}
                    <div className="flex items-center gap-6 text-sm mb-3">
                      <div className="flex items-center gap-1 min-w-[110px]">
                        {profile.gpa_unweighted ? (
                          <>
                            <BookOpen className="h-3 w-3 text-muted-foreground" />
                            <span>GPA: {profile.gpa_unweighted}</span>
                          </>
                        ) : (
                          <span className="invisible">GPA: 0.00</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 min-w-[110px]">
                        {profile.sat_score ? (
                          <>
                            <Trophy className="h-3 w-3 text-muted-foreground" />
                            <span>SAT: {profile.sat_score}</span>
                          </>
                        ) : (
                          <span className="invisible">SAT: 0000</span>
                        )}
                      </div>
                    </div>

                    {/* Colleges Admitted */}
                    {profile.colleges_admitted && profile.colleges_admitted.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-medium mb-2 flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          Accepted to:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {profile.colleges_admitted.slice(0, 3).map((college: any, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs px-3 py-1">
                              {college.school || college}
                            </Badge>
                          ))}
                          {profile.colleges_admitted.length > 3 && (
                            <Badge variant="outline" className="text-xs px-3 py-1">
                              +{profile.colleges_admitted.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Background Preview */}
                    {profile.background_story && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-3">
                        {profile.background_story}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="text-base font-medium mb-2">No profiles found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdmittedProfiles;
