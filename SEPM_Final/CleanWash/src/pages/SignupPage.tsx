import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  User,
  Mail,
  Lock,
  Building,
  ArrowLeft,
  Hash,
  Home,
} from "lucide-react";
import Logo from "@/components/Logo";
import FormSection from "@/components/FormSection";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

const hostels = [
  { id: "VEDAVATI", name: "VEDAVATI" },
  { id: "GANGA", name: "GANGA" },
  { id: "NARMADA", name: "NARMADA" },
  { id: "KRISHNA", name: "KRISHNA" },
];

const floors = Array.from({ length: 9 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Floor ${i + 1}`,
}));

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, isLoading } = useAuth();
  const role = location.state?.role || "student";

  const [formData, setFormData] = useState({
    fullName: "",
    registrationNumber: "",
    workerId: "",
    email: "",
    password: "",
    hostel: "",
    floor: "",
    assignedHostel: "",
    gender: "",
  });

  // Generate a random worker ID on mount if the role is worker
  useEffect(() => {
    if (role === "worker") {
      const randomId =
        "W" + Math.floor(10000 + Math.random() * 90000).toString();
      setFormData((prev) => ({ ...prev, workerId: randomId }));
    }
  }, [role]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.gender) {
      toast({
        title: "Gender is required",
        description: "Please select your gender to continue",
        variant: "destructive",
      });
      return;
    }

    if (role === "student" && (!formData.hostel || !formData.floor)) {
      toast({
        title: "Incomplete information",
        description: "Please fill in all the required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const userData = {
        full_name: formData.fullName,
        gender: formData.gender, // Ensure this is a simple string
        role: role,
        registration_number:
          role === "student" ? formData.registrationNumber : null,
        worker_id: role === "worker" ? formData.workerId : null,
        hostel: role === "student" ? formData.hostel : null,
        floor: role === "student" ? formData.floor : null,
        assigned_hostel: role === "worker" ? formData.assignedHostel : null,
      };

      console.log("Submitting user data:", userData);
      await signUp(formData.email, formData.password, userData);
    } catch (error) {
      console.error("Error during signup:", error);
      toast({
        title: "Error during signup",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTitle = () => {
    return role === "student" ? "Student Registration" : "Worker Registration";
  };

  const getDescription = () => {
    return role === "student"
      ? "Create your student account to manage your laundry"
      : "Create your worker account to manage laundry orders";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-laundry-softgray to-white">
      <header className="w-full py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>
          <Logo />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <FormSection
          title={getTitle()}
          description={getDescription()}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  className="pl-10 input-animated"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "student" ? (
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="registrationNumber"
                    name="registrationNumber"
                    placeholder="Enter your registration number"
                    className="pl-10 input-animated"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="workerId">Worker ID</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="workerId"
                    name="workerId"
                    placeholder="Worker ID"
                    className="pl-10 input-animated bg-gray-50"
                    value={formData.workerId}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Auto-generated worker ID
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 input-animated"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="pl-10 input-animated"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <PasswordStrengthMeter password={formData.password} />
            </div>

            {role === "student" ? (
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hostel">Hostel Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                        <Select
                          value={formData.hostel}
                          onValueChange={(value) =>
                            handleSelectChange("hostel", value)
                          }
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Select hostel" />
                          </SelectTrigger>
                          <SelectContent>
                            {hostels.map((hostel) => (
                              <SelectItem key={hostel.id} value={hostel.id}>
                                {hostel.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="floor">Floor Number</Label>
                      <div className="relative">
                        <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                        <Select
                          value={formData.floor}
                          onValueChange={(value) =>
                            handleSelectChange("floor", value)
                          }
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Select floor" />
                          </SelectTrigger>
                          <SelectContent>
                            {floors.map((floor) => (
                              <SelectItem key={floor.id} value={floor.id}>
                                {floor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignedHostel">
                      Assigned Hostel Block (Optional)
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Select
                        value={formData.assignedHostel}
                        onValueChange={(value) =>
                          handleSelectChange("assignedHostel", value)
                        }
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select hostel" />
                        </SelectTrigger>
                        <SelectContent>
                          {hostels.map((hostel) => (
                            <SelectItem key={hostel.id} value={hostel.id}>
                              {hostel.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              type="submit"
              className="w-full btn-animated"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </FormSection>
      </main>

      <footer className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CleanWash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SignupPage;
