import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Home, Key, TrendingUp, Eye, DollarSign } from "lucide-react";

const stats = [
  {
    title: "Total Properties",
    value: "24",
    change: "+2 this month",
    icon: Building2,
    color: "bg-primary",
  },
  {
    title: "For Sale",
    value: "15",
    change: "62.5%",
    icon: Home,
    color: "bg-secondary",
  },
  {
    title: "For Rent",
    value: "9",
    change: "37.5%",
    icon: Key,
    color: "bg-blue-600",
  },
  {
    title: "Best Deals",
    value: "6",
    change: "Active",
    icon: TrendingUp,
    color: "bg-emerald-600",
  },
];

const recentProperties = [
  { id: 1, title: "Modern Villa in Kigali Heights", price: "$450,000", type: "Sale", views: 234 },
  { id: 2, title: "Luxury Apartment Nyarutarama", price: "$1,500/mo", type: "Rent", views: 189 },
  { id: 3, title: "Elegant Family Home", price: "$320,000", type: "Sale", views: 156 },
  { id: 4, title: "Premium Penthouse Suite", price: "$3,500/mo", type: "Rent", views: 142 },
  { id: 5, title: "Hillside Contemporary Home", price: "$520,000", type: "Sale", views: 98 },
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your properties.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
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
            <div className="overflow-x-auto">
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
                          {property.price.replace('$', '')}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          property.type === 'Sale' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-blue-600/10 text-blue-600'
                        }`}>
                          {property.type}
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
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-heading font-semibold text-lg mb-2">Add New Property</h3>
              <p className="text-primary-foreground/80 text-sm mb-4">List a new property on your website.</p>
              <a 
                href="/admin/add-property"
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors"
              >
                Add Property
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
