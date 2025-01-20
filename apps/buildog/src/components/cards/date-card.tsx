// date-card.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Button } from "@ui/components/ui/button";

export default function DateCard() {
  const today = new Date();
  const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>The Power of Next.js</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Explore the features that make Next.js a powerful framework for React applications.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between mt-auto">
        <div className="text-sm text-muted-foreground">{formattedDate}</div>
        <Button>Read More</Button>
      </CardFooter>
    </Card>
  );
}
