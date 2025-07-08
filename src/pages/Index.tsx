import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const navigate = useNavigate();
  const handleCustomerStoreClick = () => {
    navigate('/auth'); // Always send customers to customer auth
  };
  const handleERPClick = () => {
    navigate('/erp-auth'); // Always send staff to ERP auth
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Metaflow</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your comprehensive manufacturing ERP system and premium product store
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Choose Your Access Portal</h3>
            <p className="text-blue-800">
              <strong>Customers:</strong> Shop for premium manufacturing products<br />
              <strong>Staff:</strong> Access the ERP management system
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Store</h2>
              <p className="text-gray-600 mb-6">
                Browse and purchase premium manufacturing products with secure customer authentication
              </p>
              <Button onClick={handleCustomerStoreClick} className="w-full" size="lg">
                Shop as Customer
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ERP System</h2>
              <p className="text-gray-600 mb-6">Staff access to manage inventory and 
production service operations</p>
              <Button onClick={handleERPClick} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                Staff Access (ERP)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;