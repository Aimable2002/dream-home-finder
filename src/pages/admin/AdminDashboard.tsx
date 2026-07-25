import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Home, Key, TrendingUp, Eye, DollarSign, Loader2, Mail } from "lucide-react";
import { getDashboardStats, getRecentProperties, type Property } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, forSale: 0, forRent: 0, bestDeals: 0, unreadInquiries: 0 });
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const [statsData, recent] = await Promise.all([getDashboardStats(), getRecentProperties(5)]);
        setStats(statsData);
        setRecentProperties(recent);
      } catch (error) {
        toast({
          title: "Couldn't load dashboard data",
          description: error instanceof Error ? error.message : "Something went wrong.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statCards = [
    {
      title: "Total Properties",
      value: stats.total,
      icon: Building2,
      color: "bg-primary",
    },
    {
      title: "For Sale",
      value: stats.forSale,
      icon: Home,
      color: "bg-secondary",
    },
    {
      title: "For Rent",
      value: stats.forRent,
      icon: Key,
      color: "bg-blue-600",
    },
    {
      title: "Best Deals",
      value: stats.bestDeals,
      icon: TrendingUp,
      color: "bg-emerald-600",
    },
    {
      title: "Unread Messages",
      value: stats.unreadInquiries,
      icon: Mail,
      color: "bg-rose-600",
    },
  ];

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
    return type === "rent" ? `${formatted}/mo` : formatted;
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your properties.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {statCards.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 ${stat.color} rounded-xl`}>
                        <stat.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Recent Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentProperties.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No properties yet. Add your first one to see it here.
                  </p>
                ) : (
                  <>
                    {/* Table on larger screens */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Property</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Views</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentProperties.map((property) => (
                            <tr key={property.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                              <td className="py-4 px-4">
                                <p className="font-medium">{property.title}</p>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-1 text-secondary font-semibold">
                                  <DollarSign className="h-4 w-4" />
                                  {formatPrice(property.price, property.type).replace("$", "")}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    property.type === "sale"
                                      ? "bg-primary/10 text-primary"
                                      : "bg-blue-600/10 text-blue-600"
                                  }`}
                                >
                                  {property.type === "sale" ? "Sale" : "Rent"}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Eye className="h-4 w-4" />
                                  {property.views}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Stacked cards on mobile */}
                    <div className="sm:hidden space-y-3">
                      {recentProperties.map((property) => (
                        <div key={property.id} className="p-3 rounded-lg border border-border">
                          <p className="font-medium">{property.title}</p>
                          <div className="flex items-center justify-between mt-2 text-sm">
                            <span className="text-secondary font-semibold">
                              {formatPrice(property.price, property.type)}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                property.type === "sale"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-blue-600/10 text-blue-600"
                              }`}
                            >
                              {property.type === "sale" ? "Sale" : "Rent"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-heading font-semibold text-lg mb-2">Add New</h3>
              <p className="text-primary-foreground/80 text-sm mb-4">List a property or add a team member.</p>
              <a
                href="/admin/add-property"
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors"
              >
                Add New
              </a>
            </CardContent>
          </Card>
          <Card className="bg-secondary text-secondary-foreground">
            <CardContent className="p-6">
              <h3 className="font-heading font-semibold text-lg mb-2">Manage Listings</h3>
              <p className="text-secondary-foreground/80 text-sm mb-4">Edit or remove existing properties.</p>
              <a
                href="/admin/properties"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                View All
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-heading font-semibold text-lg mb-2">Update Settings</h3>
              <p className="text-muted-foreground text-sm mb-4">Change logo and contact info.</p>
              <a
                href="/admin/settings"
                className="inline-flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                Settings
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;