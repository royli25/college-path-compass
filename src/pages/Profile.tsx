
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, Edit, GraduationCap, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfileData, getStepCompletion, calculateProfileStrength } from "@/hooks/useProfileData";

const Profile = () => {
  const { data: profile, isLoading } = useProfileData();
  const strength = calculateProfileStrength(profile);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-medium text-foreground tracking-tight">Profile Builder</h1>
          <p className="text-base text-muted-foreground">
            Your comprehensive application profile overview
          </p>
        </div>

        <Separator />

        {/* Progress Overview */}
        <Card className="ultra-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-foreground">Overall Progress</h2>
                <span className="text-xl font-semibold text-primary">{strength.overall}%</span>
              </div>
              <Progress value={strength.overall} className="h-3 rounded-full" />
              <p className="text-sm text-muted-foreground">
                Complete all sections to build a strong application profile
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Background Information Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                getStepCompletion(profile, 0) 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-primary/20 text-primary'
              }`}>
                {getStepCompletion(profile, 0) ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Background Information</h2>
                <p className="text-muted-foreground">Personal and academic background details</p>
              </div>
            </div>
            <Link to="/profile/edit/0">
              <Button variant="outline" className="rounded-xl">
                <Edit className="h-4 w-4 mr-2" />
                {getStepCompletion(profile, 0) ? "Edit" : "Complete"}
              </Button>
            </Link>
          </div>

          {profile && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pl-13">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Gender</p>
                <p className="text-sm text-muted-foreground">{profile.gender || "Not specified"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Citizenship</p>
                <p className="text-sm text-muted-foreground">{profile.citizenship || "Not specified"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Race/Ethnicity</p>
                <p className="text-sm text-muted-foreground">{profile.race_ethnicity || "Not specified"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">First Generation</p>
                <p className="text-sm text-muted-foreground">
                  {profile.first_generation !== null ? (profile.first_generation ? "Yes" : "No") : "Not specified"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Income Bracket</p>
                <p className="text-sm text-muted-foreground">{profile.income_bracket || "Not specified"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">High School</p>
                <p className="text-sm text-muted-foreground">{profile.high_school || "Not specified"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Class Rank</p>
                <p className="text-sm text-muted-foreground">{profile.class_rank || "Not specified"}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Academic Profile Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                getStepCompletion(profile, 1) 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-primary/20 text-primary'
              }`}>
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Academic Profile</h2>
                <p className="text-muted-foreground">GPA, test scores, and coursework details</p>
              </div>
            </div>
            <Link to="/profile/edit/1">
              <Button variant="outline" className="rounded-xl">
                <Edit className="h-4 w-4 mr-2" />
                {getStepCompletion(profile, 1) ? "Edit" : "Complete"}
              </Button>
            </Link>
          </div>

          {profile ? (
            <div className="space-y-6 pl-13">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">GPA (Unweighted)</p>
                  <p className="text-lg font-semibold text-primary">{profile.gpa_unweighted || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">GPA (Weighted)</p>
                  <p className="text-lg font-semibold text-primary">{profile.gpa_weighted || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">SAT/ACT Score</p>
                  <p className="text-lg font-semibold text-primary">{profile.sat_act_score || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Class Rank</p>
                  <p className="text-sm text-muted-foreground">{profile.class_rank || "Not specified"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">AP/IB Courses</p>
                {profile.ap_ib_courses && profile.ap_ib_courses.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.ap_ib_courses.map((course, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {typeof course === 'string' ? course : course.course}
                        {typeof course === 'object' && course.score && (
                          <span className="ml-1 text-primary">({course.score})</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No AP/IB courses added</p>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Current Courses</p>
                {profile.current_courses && profile.current_courses.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.current_courses.map((course, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {course}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No current courses added</p>
                )}
              </div>
            </div>
          ) : (
            <div className="pl-13">
              <p className="text-sm text-muted-foreground">Complete your academic profile to see details here</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Activities & Leadership Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                getStepCompletion(profile, 2) 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-primary/20 text-primary'
              }`}>
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Activities & Leadership</h2>
                <p className="text-muted-foreground">Extracurricular activities and leadership roles</p>
              </div>
            </div>
            <Link to="/profile/edit/2">
              <Button variant="outline" className="rounded-xl">
                <Edit className="h-4 w-4 mr-2" />
                {getStepCompletion(profile, 2) ? "Edit" : "Complete"}
              </Button>
            </Link>
          </div>

          {profile ? (
            <div className="space-y-6 pl-13">
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Activities</p>
                {profile.activities && profile.activities.length > 0 ? (
                  <div className="space-y-3">
                    {profile.activities.map((activity, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{activity.name}</h4>
                              {activity.position && (
                                <Badge variant="outline">{activity.position}</Badge>
                              )}
                              {activity.yearsInvolved && (
                                <Badge variant="secondary">{activity.yearsInvolved} years</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No activities added</p>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Leadership Positions</p>
                {profile.leadership_positions && profile.leadership_positions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.leadership_positions.map((position, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {position}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No leadership positions added</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Years Involved</p>
                <p className="text-sm text-muted-foreground">
                  {profile.years_involved ? `${profile.years_involved} years` : "Not specified"}
                </p>
              </div>
            </div>
          ) : (
            <div className="pl-13">
              <p className="text-sm text-muted-foreground">Complete your activities profile to see details here</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Honors & Awards Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                getStepCompletion(profile, 3) 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-primary/20 text-primary'
              }`}>
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Honors & Awards</h2>
                <p className="text-muted-foreground">Academic and extracurricular achievements</p>
              </div>
            </div>
            <Link to="/profile/edit/3">
              <Button variant="outline" className="rounded-xl">
                <Edit className="h-4 w-4 mr-2" />
                {getStepCompletion(profile, 3) ? "Edit" : "Complete"}
              </Button>
            </Link>
          </div>

          {profile ? (
            <div className="space-y-6 pl-13">
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Awards & Honors</p>
                {profile.honors_awards && profile.honors_awards.length > 0 ? (
                  <div className="space-y-3">
                    {profile.honors_awards.map((award, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{award.name}</h4>
                              <Badge variant="outline">{award.level}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{award.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No awards or honors added</p>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Achievement Levels</p>
                {profile.achievement_levels && profile.achievement_levels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.achievement_levels.map((level, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {level}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No achievement levels specified</p>
                )}
              </div>
            </div>
          ) : (
            <div className="pl-13">
              <p className="text-sm text-muted-foreground">Complete your honors and awards to see details here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
