
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleCustomerStoreClick = () => {
    if (user) {
      navigate('/customer');
    } else {
      navigate('/auth');
    }
  };

  const handleERPClick = () => {
    if (user) {
      navigate('/erp');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Metaflow</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your comprehensive manufacturing ERP system and premium product store
          </p>

          {!loading && !user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800 font-medium">
                Please sign in to access the Customer Store and ERP Dashboard
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                className="mt-2"
              >
                Sign In / Sign Up
              </Button>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Store</h2>
              <p className="text-gray-600 mb-6">
                Browse and purchase premium manufacturing products with secure authentication
              </p>
              <Button 
                onClick={handleCustomerStoreClick}
                className="w-full"
                size="lg"
              >
                {user ? 'Shop Now' : 'Sign In to Shop'}
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ERP Dashboard</h2>
              <p className="text-gray-600 mb-6">
                Manage inventory, production, and customer service operations
              </p>
              <Button 
                onClick={handleERPClick}
                className="w-full"
                size="lg"
              >
                {user ? 'Access ERP System' : 'Sign In for ERP'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
