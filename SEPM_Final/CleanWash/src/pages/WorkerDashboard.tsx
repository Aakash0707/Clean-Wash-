import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Package, RefreshCw } from "lucide-react";
import Logo from "@/components/Logo";
import OrderList from "@/components/worker/OrderList";
import { useOrdersData } from "@/hooks/useOrdersData";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";

const WorkerDashboard = () => {
  const { signOut, profile } = useAuth();
  const { orders, activeOrders, loading, refreshOrders } = useOrdersData();

  const handleRefresh = () => {
    toast({
      title: "Refreshing orders",
      description: "Getting the latest orders...",
    });
    refreshOrders();
  };

  // Initial loading effect and periodic refresh
  useEffect(() => {
    // Set up a periodic refresh every 30 seconds as a fallback
    const intervalId = setInterval(() => {
      console.log("Performing periodic refresh of orders");
      refreshOrders();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [refreshOrders]);

  // Log order counts to help with debugging
  useEffect(() => {
    console.log("Worker Dashboard - Orders count:", orders?.length || 0);
    console.log(
      "Worker Dashboard - Active orders count:",
      activeOrders?.length || 0
    );
  }, [orders, activeOrders]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full py-4 px-4 bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 mr-2">
              welcome , {profile?.full_name}
            </span>
            <Button
              variant="outline"
              onClick={() => signOut()}
              size="sm"
              className="text-sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Worker Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome to your dashboard. Here you can manage laundry orders
                and update their status.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-1"
              disabled={loading.orders || loading.activeOrders}
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading.orders || loading.activeOrders ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
          </div>

          <Tabs defaultValue="active-orders" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="active-orders">Active Orders</TabsTrigger>
              <TabsTrigger value="new-orders">New Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="active-orders" className="space-y-6">
              <OrderList
                title="Active Orders"
                description="Manage orders that are currently being processed"
                icon={Package}
                orders={activeOrders}
                loading={loading.activeOrders}
                emptyMessage="No active orders at the moment"
                emptySubMessage="Accept new orders from the New Orders tab"
              />
            </TabsContent>

            <TabsContent value="new-orders" className="space-y-6">
              <OrderList
                title="New Orders"
                description="Accept new orders to process"
                icon={Clock}
                orders={orders}
                loading={loading.orders}
                emptyMessage="No new orders available at the moment"
                emptySubMessage="New orders will appear here when students place them"
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="py-6 px-4 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CleanWash. All rights reserved.
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
};

export default WorkerDashboard;
