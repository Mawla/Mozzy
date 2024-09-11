"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";

export function IcpFullPageFormUpdated() {
  const [formData, setFormData] = useState({
    companyName: "",
    companySize: "",
    industry: "",
    location: "",
    annualRevenue: "",
    painPoints: [] as string[],
    goals: [] as string[],
    decisionMakers: "",
    purchaseProcess: "",
    budget: "",
    timeframe: "",
  });

  const [newPainPoint, setNewPainPoint] = useState("");
  const [newGoal, setNewGoal] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddPainPoint = () => {
    if (newPainPoint.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        painPoints: [...prevData.painPoints, newPainPoint.trim()],
      }));
      setNewPainPoint("");
    }
  };

  const handleRemovePainPoint = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      painPoints: prevData.painPoints.filter((_, i) => i !== index),
    }));
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        goals: [...prevData.goals, newGoal.trim()],
      }));
      setNewGoal("");
    }
  };

  const handleRemoveGoal = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      goals: prevData.goals.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend or perform further processing
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Define Your Ideal Customer Profile (ICP)
          </CardTitle>
          <CardDescription className="text-lg">
            Complete the form below to create a detailed profile of your ideal
            customer.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="e.g., Acme Corp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select
                    name="companySize"
                    onValueChange={handleSelectChange("companySize")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501+">501+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Industry and Market</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., North America, Europe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="annualRevenue">Annual Revenue</Label>
                <Select
                  name="annualRevenue"
                  onValueChange={handleSelectChange("annualRevenue")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select annual revenue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<1M">Less than $1 million</SelectItem>
                    <SelectItem value="1M-10M">
                      $1 million - $10 million
                    </SelectItem>
                    <SelectItem value="10M-50M">
                      $10 million - $50 million
                    </SelectItem>
                    <SelectItem value="50M-100M">
                      $50 million - $100 million
                    </SelectItem>
                    <SelectItem value="100M+">
                      More than $100 million
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Pain Points and Needs</h3>
              <div className="space-y-2">
                <Label htmlFor="painPoints">Key Pain Points</Label>
                <div className="flex space-x-2">
                  <Input
                    id="painPoints"
                    value={newPainPoint}
                    onChange={(e) => setNewPainPoint(e.target.value)}
                    placeholder="Enter a pain point"
                  />
                  <Button
                    type="button"
                    onClick={handleAddPainPoint}
                    size="icon"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only">Add pain point</span>
                  </Button>
                </div>
                <ul className="mt-2 space-y-2">
                  {formData.painPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-muted p-2 rounded-md"
                    >
                      <span>{point}</span>
                      <Button
                        type="button"
                        onClick={() => handleRemovePainPoint(index)}
                        variant="ghost"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove pain point</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goals">Goals and Objectives</Label>
                <div className="flex space-x-2">
                  <Input
                    id="goals"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Enter a goal"
                  />
                  <Button type="button" onClick={handleAddGoal} size="icon">
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only">Add goal</span>
                  </Button>
                </div>
                <ul className="mt-2 space-y-2">
                  {formData.goals.map((goal, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-muted p-2 rounded-md"
                    >
                      <span>{goal}</span>
                      <Button
                        type="button"
                        onClick={() => handleRemoveGoal(index)}
                        variant="ghost"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove goal</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Decision-Making Process</h3>
              <div className="space-y-2">
                <Label htmlFor="decisionMakers">Key Decision Makers</Label>
                <Input
                  id="decisionMakers"
                  name="decisionMakers"
                  value={formData.decisionMakers}
                  onChange={handleInputChange}
                  placeholder="e.g., CTO, VP of Marketing"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseProcess">
                  Typical Purchase Process
                </Label>
                <Textarea
                  id="purchaseProcess"
                  name="purchaseProcess"
                  value={formData.purchaseProcess}
                  onChange={handleInputChange}
                  placeholder="Describe the steps in their buying process"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Budget and Purchasing Habits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Typical Budget</Label>
                  <Input
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="e.g., $10,000 - $50,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Purchase Timeframe</Label>
                  <Select
                    name="timeframe"
                    onValueChange={handleSelectChange("timeframe")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="1-3 months">1-3 months</SelectItem>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="6-12 months">6-12 months</SelectItem>
                      <SelectItem value="12+ months">12+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Define ICP
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
