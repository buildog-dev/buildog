import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Button } from "@ui/components/ui/button";

export default function DefaultCard() {
  return (
    <Card className="bg-white shadow-md flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Default Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Explore the features that make Next.js a powerful framework for React applications.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Read More</Button>
      </CardFooter>
    </Card>
  );
}
