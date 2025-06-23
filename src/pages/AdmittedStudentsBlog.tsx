import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Calendar, Clock, User, BookOpen, TrendingUp, Lightbulb, Target, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar?: string;
  publishedDate: string;
  readTime: number;
  category: string;
  tags: string[];
  featured: boolean;
  imageUrl?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Write a Standout Personal Statement",
    excerpt: "Learn the secrets to crafting a compelling personal statement that admissions officers can't ignore.",
    content: "Your personal statement is often the first impression admissions officers have of you...",
    author: "Dr. Sarah Chen",
    publishedDate: "2024-01-15",
    readTime: 8,
    category: "Essays",
    tags: ["personal statement", "writing", "admissions"],
    featured: true,
  },
  {
    id: "2",
    title: "The Complete Guide to Extracurricular Activities",
    excerpt: "Discover how to choose and excel in activities that will strengthen your college application.",
    content: "Extracurricular activities are more than just resume fillers...",
    author: "Michael Rodriguez",
    publishedDate: "2024-01-12",
    readTime: 12,
    category: "Activities",
    tags: ["extracurriculars", "leadership", "activities"],
    featured: true,
  },
  {
    id: "3",
    title: "SAT vs ACT: Which Test Should You Take?",
    excerpt: "A comprehensive comparison to help you choose the right standardized test for your college applications.",
    content: "Choosing between the SAT and ACT can feel overwhelming...",
    author: "Emily Johnson",
    publishedDate: "2024-01-10",
    readTime: 6,
    category: "Testing",
    tags: ["SAT", "ACT", "standardized tests"],
    featured: false,
  },
  {
    id: "4",
    title: "Building Your College List: Reach, Target, and Safety Schools",
    excerpt: "Strategic advice on creating a balanced college list that maximizes your chances of acceptance.",
    content: "Creating your college list is one of the most important decisions...",
    author: "David Kim",
    publishedDate: "2024-01-08",
    readTime: 10,
    category: "College Selection",
    tags: ["college list", "admissions strategy", "school selection"],
    featured: false,
  },
  {
    id: "5",
    title: "Financial Aid and Scholarships: What You Need to Know",
    excerpt: "Navigate the complex world of financial aid and discover scholarship opportunities.",
    content: "Understanding financial aid can be as challenging as the application process itself...",
    author: "Lisa Thompson",
    publishedDate: "2024-01-05",
    readTime: 15,
    category: "Financial Aid",
    tags: ["financial aid", "scholarships", "cost"],
    featured: false,
  },
  {
    id: "6",
    title: "Interview Preparation: Making a Great Impression",
    excerpt: "Tips and strategies to ace your college interviews and make a lasting positive impression.",
    content: "College interviews can be nerve-wracking, but with proper preparation...",
    author: "James Wilson",
    publishedDate: "2024-01-03",
    readTime: 7,
    category: "Interviews",
    tags: ["interviews", "preparation", "communication"],
    featured: false,
  },
];

const categories = [
  { id: "all", label: "All Articles", icon: BookOpen },
  { id: "Essays", label: "Essays", icon: FileText },
  { id: "Activities", label: "Activities", icon: TrendingUp },
  { id: "Testing", label: "Testing", icon: Target },
  { id: "College Selection", label: "College Selection", icon: BookOpen },
  { id: "Financial Aid", label: "Financial Aid", icon: Lightbulb },
  { id: "Interviews", label: "Interviews", icon: User },
];

const AdmittedStudentsBlog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    if (selectedCategory === "all") return matchesSearch;
    return matchesSearch && post.category === selectedCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Admitted Students Blog</h1>
          <p className="text-muted-foreground">
            Learn from the stories of successful applicants
          </p>
        </div>

        {isLoading ? (
          <p>Loading articles...</p>
        ) : isError ? (
          <p>Error loading articles.</p>
        ) : (
          <div>
            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {category.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Featured Articles */}
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-6">Featured Articles</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => (
                    <Card key={post.id} className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary">{post.category}</Badge>
                          {post.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl mb-3">{post.title}</CardTitle>
                        <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {post.author.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <p className="font-medium">{post.author}</p>
                              <p className="text-muted-foreground">{formatDate(post.publishedDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {post.readTime} min read
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles */}
            <div>
              <h2 className="text-xl font-semibold mb-6">All Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <Card key={post.id} className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{post.category}</Badge>
                      </div>
                      <CardTitle className="text-lg mb-3 line-clamp-2">{post.title}</CardTitle>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {post.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {post.readTime} min
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.publishedDate)}
                        </span>
                        <div className="flex gap-1">
                          {post.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base font-medium mb-2">No articles found</h3>
                  <p className="text-muted-foreground">
                    Please check back later for new content.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmittedStudentsBlog; 