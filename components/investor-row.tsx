"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronDown,
  ChevronUp,
  Globe,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Briefcase,
  Target,
  TrendingUp,
  Award,
  User2,
  MapPin,
  Calendar,
  LucideIcon,
} from "lucide-react";
import { NoteDialog } from "@/components/note-dialog";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const InvestorRow = ({ investor }: { investor: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const socialLinks = [
    { icon: Globe, label: "Website", link: investor.Website },
    { icon: Twitter, label: "Twitter", link: investor["Twitter Link"] },
    { icon: Linkedin, label: "LinkedIn", link: investor["LinkedIn Link"] },
    { icon: Facebook, label: "Facebook", link: investor["Facebook Link"] },
    { icon: Mail, label: "Email", link: `mailto:${investor["Partner Email"]}` },
  ];

  const { data: note, isLoading: isLoadingNote } = useQuery({
    queryKey: ["note", investor["S.no"]],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/notes?investorId=${investor["S.no"]}`);
        if (!res.ok) {
          throw new Error("Failed to fetch note");
        }
        const data = await res.json();
        return data;
      } catch (error) {
        console.error("Error fetching note:", error);
        return null;
      }
    },
    enabled: !!session?.user?.email,
  });

  return (
    <Card className="w-full hover-scale transition-all border-opacity-40 hover:border-primary/60 hover:shadow-lg">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-primary/20">
                <AvatarImage
                  src={`https://placehold.co/200x200?text=${investor[
                    "Investor Name"
                  ].charAt(0)}`}
                  alt={investor["Investor Name"]}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary/40 text-white text-xl">
                  {investor["Investor Name"].charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  {investor["Investor Name"]}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {investor.Location}
                  <span className="text-muted-foreground">•</span>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Founded {investor["Founding Year"]}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                {socialLinks.map(
                  (social, index) =>
                    social.link && (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/10 transition-colors"
                            asChild
                          >
                            <a
                              href={social.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary/80 hover:text-primary"
                            >
                              <social.icon className="h-4 w-4" />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{social.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NoteDialog
                      investorId={investor["S.no"].toString()}
                      existingNote={note?.content}
                      isLoading={isLoadingNote}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{note?.content ? "Edit Note" : "Add Note"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 transition-colors"
                >
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-primary" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-primary" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent className="animate-in">
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard
                title="Fund Type"
                value={investor["Fund Type"]}
                icon={Briefcase}
              />
              <StatCard
                title="Fund Stage"
                value={investor["Fund Stage"]}
                icon={Target}
              />
              <StatCard
                title="Investments"
                value={investor["Number of Investments"]}
                icon={TrendingUp}
              />
              <StatCard
                title="Exits"
                value={investor["Number of Exits"]}
                icon={Award}
              />
            </div>

            {investor["Partner Name"] && (
              <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
                <User2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Partner</p>
                  <p className="text-sm text-muted-foreground">
                    {investor["Partner Name"]}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors">
      <div className="p-2 bg-primary/10 rounded-full">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
