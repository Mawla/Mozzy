import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Target, BarChart } from "lucide-react";
import Link from "next/link";

export default function ICPInfo() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Ideal Customer Profile (ICP)
      </h1>
      <p className="text-xl text-center mb-12 text-muted-foreground">
        Understanding and defining your Ideal Customer Profile is crucial for
        business success.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What is an ICP?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              An Ideal Customer Profile (ICP) is a detailed description of the
              type of company that would benefit most from your product or
              service. It goes beyond basic demographics to include
              psychographics, behavior patterns, and specific pain points.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why is ICP Important?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Focuses marketing efforts
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Improves lead quality
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Increases conversion rates
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Enhances customer retention
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Key Characteristics of an ICP</CardTitle>
          <CardDescription>
            Consider these factors when developing your Ideal Customer Profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Company Size</h3>
                <p className="text-sm text-muted-foreground">
                  Number of employees, revenue
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Industry</h3>
                <p className="text-sm text-muted-foreground">
                  Specific sectors or verticals
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Pain Points</h3>
                <p className="text-sm text-muted-foreground">
                  Challenges your product solves
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Decision Makers</h3>
                <p className="text-sm text-muted-foreground">
                  Roles involved in purchasing
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Geography</h3>
                <p className="text-sm text-muted-foreground">
                  Location of ideal customers
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Budget</h3>
                <p className="text-sm text-muted-foreground">
                  Typical spending on solutions
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ready to Define Your ICP?</CardTitle>
          <CardDescription>
            Take the first step towards more effective marketing and sales
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Link href="/dashboard/icp/create">
            <Button size="lg">Start Defining Your ICP</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
