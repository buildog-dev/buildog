import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Button } from "@ui/components/ui/button";

export default function DateCard() {
  const today = new Date();
  const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="flex flex-col">
        <CardHeader>
          <h3 className="text-lg font-semibold">The Power of Next.js</h3>
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
      <Card className="flex flex-col">
        <CardHeader>
          <h3 className="text-lg font-semibold">The Power of Next.js</h3>
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
      <Card className="flex flex-col">
        <CardHeader>
          <h3 className="text-lg font-semibold">The Power of Next.js</h3>
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
      <Card className="flex flex-col">
        <CardHeader>
          <h3 className="text-lg font-semibold">The Power of Next.js</h3>
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
      <Card className="flex flex-col">
        <CardHeader>
          <h3 className="text-lg font-semibold">The Power of Next.js</h3>
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
    </div>
  );
}
