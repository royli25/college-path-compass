
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import { Search, Plus, X, BookOpen, Briefcase, Heart, Beaker } from "lucide-react";

const Majors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajors, setSelectedMajors] = useState([
    "Computer Science",
    "Data Science",
    "Software Engineering"
  ]);

  const majorCategories = [
    {
      name: "STEM",
      icon: Beaker,
      color: "text-blue-600",
      majors: [
        "Computer Science", "Engineering", "Mathematics", "Physics", "Chemistry",
        "Biology", "Data Science", "Software Engineering", "Cybersecurity",
        "Artificial Intelligence", "Robotics", "Environmental Science"
      ]
    },
    {
      name: "Business",
      icon: Briefcase,
      color: "text-green-600",
      majors: [
        "Business Administration", "Finance", "Marketing", "Economics",
        "International Business", "Accounting", "Management", "Entrepreneurship",
        "Supply Chain Management", "Human Resources"
      ]
    },
    {
      name: "Liberal Arts",
      icon: BookOpen,
      color: "text-purple-600",
      majors: [
        "English Literature", "History", "Philosophy", "Political Science",
        "Psychology", "Sociology", "Anthropology", "Linguistics",
        "Creative Writing", "Communications", "Journalism"
      ]
    },
    {
      name: "Health & Medicine",
      icon: Heart,
      color: "text-red-600",
      majors: [
        "Pre-Medicine", "Nursing", "Public Health", "Biomedical Engineering",
        "Physical Therapy", "Pharmacy", "Dentistry", "Veterinary Science",
        "Health Administration", "Nutrition"
      ]
    }
  ];

  const toggleMajor = (major: string) => {
    setSelectedMajors(prev =>
      prev.includes(major)
        ? prev.filter(m => m !== major)
        : [...prev, major]
    );
  };

  const removeMajor = (major: string) => {
    setSelectedMajors(prev => prev.filter(m => m !== major));
  };

  const filteredCategories = majorCategories.map(category => ({
    ...category,
    majors: category.majors.filter(major =>
      major.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.majors.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Explore Majors & Interests
          </h1>
          <p className="text-muted-foreground">
            Select your areas of interest to help us recommend the best schools for you
          </p>
        </div>

        {/* Selected Majors */}
        {selectedMajors.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Selected Majors ({selectedMajors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedMajors.map((major) => (
                  <Badge
                    key={major}
                    variant="default"
                    className="flex items-center space-x-2 px-3 py-1"
                  >
                    <span>{major}</span>
                    <button
                      onClick={() => removeMajor(major)}
                      className="ml-2 hover:bg-primary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for majors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Major Categories */}
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Icon className={`h-6 w-6 ${category.color}`} />
                    <span>{category.name}</span>
                    <Badge variant="secondary">{category.majors.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {category.majors.map((major) => {
                      const isSelected = selectedMajors.includes(major);
                      return (
                        <Button
                          key={major}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleMajor(major)}
                          className="justify-start text-left h-auto p-3 whitespace-normal"
                        >
                          <div className="flex items-center space-x-2 w-full">
                            {isSelected ? (
                              <X className="h-4 w-4 flex-shrink-0" />
                            ) : (
                              <Plus className="h-4 w-4 flex-shrink-0" />
                            )}
                            <span className="text-sm">{major}</span>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No majors found matching "{searchTerm}"</p>
                <p className="text-sm">Try adjusting your search terms.</p>
              </div>
              <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        {selectedMajors.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <Button size="lg" className="shadow-lg">
              Save Interests ({selectedMajors.length})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Majors;
