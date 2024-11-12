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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 ring-2 ring-offset-2 ring-primary/20 flex-shrink-0">
                <AvatarImage
                  src={`https://placehold.co/200x200?text=${investor[
                    "Investor Name"
                  ].charAt(0)}`}
                  alt={investor["Investor Name"]}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary/40 text-white text-lg sm:text-xl">
                  {investor["Investor Name"].charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <CardTitle className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 truncate">
                  {investor["Investor Name"]}
                </CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{investor.Location}</span>
                  </div>
                  <span className="text-muted-foreground hidden sm:inline">
                    •
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">
                      Founded {investor["Founding Year"]}
                    </span>
                  </div>
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
              <div className="flex items-center gap-1 sm:gap-4">
                <TooltipProvider delayDuration={0}>
                  {socialLinks.map(
                    (social, index) =>
                      social.link && (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-primary/10 transition-colors h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
                              asChild
                            >
                              <a
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary/80 hover:text-primary flex items-center justify-center"
                              >
                                <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>{social.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      )
                  )}
                  <div className="h-5 w-px bg-border mx-1 sm:mx-2 flex-shrink-0" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NoteDialog
                        investorId={investor["S.no"].toString()}
                        existingNote={note?.content}
                        isLoading={isLoadingNote}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{note?.content ? "Edit Note" : "Add Note"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 transition-colors h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
                  >
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    ) : (
                      <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent className="animate-in">
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <User2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm sm:text-base">Partner</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
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
    <div className="flex items-center gap-3 p-3 sm:p-4 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors">
      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full">
        <Icon className="h-4 w-12 sm:h-5 sm:w-5 text-primary" />
      </div>
      <div>
        <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
        <p className="text-sm sm:text-base font-semibold">{value}</p>
      </div>
    </div>
  );
}
