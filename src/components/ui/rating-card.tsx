
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressRing from "./progress-ring";
import { cn } from "@/lib/utils";

interface RatingCardProps {
  title: string;
  score: number;
  maxScore?: number;
  description?: string;
  className?: string;
}

const RatingCard = ({ 
  title, 
  score, 
  maxScore = 100, 
  description, 
  className 
}: RatingCardProps) => {
  const percentage = Math.round((score / maxScore) * 100);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Card className={cn("ultra-card smooth-hover", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className={cn("text-2xl font-semibold", getScoreColor(percentage))}>
                {score}
              </span>
              <span className="text-muted-foreground">/{maxScore}</span>
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <ProgressRing progress={percentage} size={70} strokeWidth={6} />
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingCard;
