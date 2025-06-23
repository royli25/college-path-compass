import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, GraduationCap, MapPin, Trophy, BookOpen, Users, Award, Quote, FileText } from "lucide-react";
import { useAdmittedProfile } from "@/hooks/useAdmittedProfiles";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const AdmittedProfileDetail = () => {
  const { profileId } = useParams();
  const { data: profile, isLoading, error } = useAdmittedProfile(profileId);

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-xl font-bold mb-4">Profile not found</h1>
          <p className="text-muted-foreground mb-6">The profile you're looking for doesn't exist.</p>
          <Link to="/resources/admitted-profiles">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profiles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/resources/admitted-profiles">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profiles
            </Button>
          </Link>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      Class of {profile.graduation_year}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.high_school}
                    </span>
                    {profile.intended_major && (
                      <Badge variant="secondary">{profile.intended_major}</Badge>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {profile.gpa_unweighted && (
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-xl font-bold text-primary">{profile.gpa_unweighted}</div>
                        <div className="text-xs text-muted-foreground">Unweighted GPA</div>
                      </div>
                    )}
                    {profile.gpa_weighted && (
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-xl font-bold text-primary">{profile.gpa_weighted}</div>
                        <div className="text-xs text-muted-foreground">Weighted GPA</div>
                      </div>
                    )}
                    {profile.sat_score && (
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-xl font-bold text-primary">{profile.sat_score}</div>
                        <div className="text-xs text-muted-foreground">SAT Score</div>
                      </div>
                    )}
                    {profile.act_score && (
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-xl font-bold text-primary">{profile.act_score}</div>
                        <div className="text-xs text-muted-foreground">ACT Score</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Essays Section - Full Width */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Essays
              </CardTitle>
              <CardDescription>
                Read essays from {profile.name}'s college applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profile.essay_excerpts && profile.essay_excerpts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.essay_excerpts.map((essay: any, index: number) => (
                    <Card key={index} className="bg-muted/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{essay.title}</CardTitle>
                        {essay.prompt && <p className="text-sm text-muted-foreground pt-1">{essay.prompt}</p>}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground/80 line-clamp-3 mb-4">
                          {essay.content}
                        </p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="secondary" size="sm">Read Full Essay</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>{essay.title}</DialogTitle>
                            </DialogHeader>
                            <div className="prose dark:prose-invert overflow-y-auto h-full pr-4">
                              <p>{essay.content}</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p>No essays are available for this profile yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Background Story */}
            {profile.background_story && (
             <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Background Story
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {profile.background_story}
                  </p>
               </CardContent>
             </Card>
           )}

            {/* Activities & Leadership */}
            {profile.activities && profile.activities.length > 0 && (
             <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Activities & Leadership
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                    {profile.activities.map((activity: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4">
                        <h4 className="font-medium">{activity.name}</h4>
                        <div className="text-sm text-muted-foreground mt-1">
                          {activity.years && `${activity.years} years`}
                          {activity.hours_per_week && ` • ${activity.hours_per_week} hrs/week`}
                        </div>
                      </div>
                    ))}
                  </div>
               </CardContent>
             </Card>
           )}

            {/* Honors & Awards */}
            {profile.honors_awards && profile.honors_awards.length > 0 && (
             <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Honors & Awards
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-2">
                    {profile.honors_awards.map((award: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span>{typeof award === 'string' ? award : award.name}</span>
                      </div>
                    ))}
                  </div>
               </CardContent>
             </Card>
           )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* College Admissions Results */}
             <Card>
               <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  College Admissions Results
                </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                {/* Accepted */}
                {profile.colleges_admitted && profile.colleges_admitted.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Accepted</h4>
                    <div className="space-y-2">
                      {profile.colleges_admitted.map((college: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="font-medium">{college.school || college}</span>
                          {college.program && (
                            <Badge variant="outline" className="text-xs">
                              {college.program}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Waitlisted */}
                {profile.colleges_waitlisted && profile.colleges_waitlisted.length > 0 && (
                  <div>
                    <h4 className="font-medium text-yellow-700 mb-2">Waitlisted</h4>
                    <div className="space-y-2">
                      {profile.colleges_waitlisted.map((college: any, index: number) => (
                        <div key={index} className="p-2 bg-yellow-50 rounded">
                          <span>{college.school || college}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejected */}
                {profile.colleges_rejected && profile.colleges_rejected.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">Rejected</h4>
                    <div className="space-y-2">
                      {profile.colleges_rejected.map((college: any, index: number) => (
                        <div key={index} className="p-2 bg-red-50 rounded">
                          <span>{college.school || college}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
               </CardContent>
             </Card>

            {/* Advice */}
            {profile.advice && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Quote className="h-5 w-5" />
                    Advice for Future Applicants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                    "{profile.advice}"
                  </blockquote>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmittedProfileDetail;
