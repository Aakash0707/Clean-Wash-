import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Briefcase } from "lucide-react";
import Logo from "@/components/Logo";
import RoleCard from "@/components/RoleCard";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-center sm:justify-between items-center">
          <Logo size="lg" />
          <div className="hidden sm:block">
            <a
              href="/signup"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Don't have an account? Sign Up
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="py-12 flex-1 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Welcome to CleanWash
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your comprehensive laundry management solution for campus life.
              </p>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Choose Your Role
              </h2>
              <p className="text-gray-600">Select how you'll use the system</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center sm:items-stretch">
              <a href="/login">
                <RoleCard
                  title="Student"
                  description="Manage your laundry orders and track their status"
                  icon={User}
                  bgColor="bg-laundry-lavender"
                  onClick={() =>
                    navigate("/signup", { state: { role: "student" } })
                  }
                />
              </a>
              <a href="/login">
                <RoleCard
                  title="Worker"
                  description="Process the laundry orders and update their status"
                  icon={Briefcase}
                  bgColor="bg-laundry-lightblue"
                  onClick={() =>
                    navigate("/signup", { state: { role: "worker" } })
                  }
                />
              </a>
            </div>

            <div className="mt-8 text-center sm:hidden">
              <a
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Already have an account? Login
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CleanWash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
