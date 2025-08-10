
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  bgColor: string;
  onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  icon: Icon,
  bgColor,
  onClick
}) => {
  return (
    <Card className={`role-card ${bgColor} w-full max-w-sm`}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 mb-2">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button 
          className="btn-animated w-full bg-white text-primary hover:bg-white/90" 
          variant="outline" 
          onClick={onClick}
        >
          Continue as {title}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleCard;
