import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Mail, MailOpen, Trash2, Loader2, Phone } from "lucide-react";
import { getInquiries, markInquiryRead, deleteInquiry, type Inquiry } from "@/lib/api";

const ManageMessages = () => {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      setInquiries(await getInquiries());
    } catch (error) {
      toast({
        title: "Couldn't load messages",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkRead = async (inquiry: Inquiry) => {
    if (inquiry.status === "read") return;
    try {
      await markInquiryRead(inquiry.id);
      setInquiries((prev) => prev.map((i) => (i.id === inquiry.id ? { ...i, status: "read" } : i)));
    } catch (error) {
      toast({
        title: "Couldn't update message",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (inquiry: Inquiry) => {
    try {
      await deleteInquiry(inquiry.id);
      setInquiries((prev) => prev.filter((i) => i.id !== inquiry.id));
      toast({ title: "Message deleted" });
    } catch (error) {
      toast({
        title: "Couldn't delete message",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const unreadCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Inquiries submitted through the Contact page{unreadCount > 0 ? ` \u2014 ${unreadCount} unread` : ""}.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Inbox ({inquiries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : inquiries.length > 0 ? (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    onClick={() => handleMarkRead(inquiry)}
                    className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                      inquiry.status === "new"
                        ? "border-secondary bg-secondary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {inquiry.status === "new" ? (
                          <Mail className="h-4 w-4 text-secondary flex-shrink-0" />
                        ) : (
                          <MailOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <p className="font-semibold">{inquiry.name}</p>
                        {inquiry.status === "new" && <Badge className="bg-secondary text-secondary-foreground">New</Badge>}
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this message from {inquiry.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(inquiry)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                      <a href={`mailto:${inquiry.email}`} className="hover:text-secondary" onClick={(e) => e.stopPropagation()}>
                        {inquiry.email}
                      </a>
                      {inquiry.phone && (
                        <a href={`tel:${inquiry.phone}`} className="hover:text-secondary flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Phone className="h-3.5 w-3.5" />
                          {inquiry.phone}
                        </a>
                      )}
                      <span>{new Date(inquiry.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm">{inquiry.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No messages yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ManageMessages;