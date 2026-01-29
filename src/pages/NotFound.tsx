import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container-custom">
          <div className="text-center max-w-xl mx-auto">
            <div className="mb-8">
              <span className="text-8xl font-heading font-bold text-secondary">404</span>
            </div>
            
            <h1 className="heading-2 text-foreground mb-4">
              Page Not Found
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8">
              Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link to="/properties">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Browse Properties
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
