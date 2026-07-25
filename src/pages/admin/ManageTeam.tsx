import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Trash2, Star, Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTeamMembers, deleteTeamMember, updateTeamMember, type TeamMember } from "@/lib/api";

const ManageTeam = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const data = await getTeamMembers();
      setMembers(data);
    } catch (error) {
      toast({
        title: "Couldn't load team members",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (member: TeamMember) => {
    try {
      await deleteTeamMember(member);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      toast({ title: "Team Member Removed", description: "They no longer appear on the Team page." });
    } catch (error) {
      toast({
        title: "Couldn't remove team member",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (member: TeamMember) => {
    try {
      await updateTeamMember(member.id, { featured: !member.featured });
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, featured: !m.featured } : m))
      );
      toast({ title: "Status Updated" });
    } catch (error) {
      toast({
        title: "Couldn't update status",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Manage Team</h1>
            <p className="text-muted-foreground mt-1">View, feature, or remove staff profiles.</p>
          </div>
          <a href="/admin/add-property">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Add Team Member
            </Button>
          </a>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : filtered.length > 0 ? (
              <div className="space-y-4">
                {filtered.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                  >
                    <img
                      src={member.image_url ?? "/placeholder.svg"}
                      alt={member.name}
                      className="w-20 h-20 object-cover rounded-full sm:rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.position}</p>
                        </div>
                        {member.featured && (
                          <Badge className="bg-secondary text-secondary-foreground">Featured</Badge>
                        )}
                      </div>
                      {member.bio && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{member.bio}</p>
                      )}
                    </div>
                    <div className="flex sm:flex-col gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFeatured(member)}
                        className={member.featured ? "text-secondary border-secondary" : ""}
                      >
                        <Star className={`h-4 w-4 ${member.featured ? "fill-secondary" : ""}`} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove {member.name} from the Team page.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(member)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No team members yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ManageTeam;