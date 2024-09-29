import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Button } from "@ui/components/ui/button";

export default function DefaultCard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Default Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            A clean and simple design for a focused reading experience.
          </p>
        </CardContent>
        <CardFooter>
          <Button>Read More</Button>
        </CardFooter>
      </Card>
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Default Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            A clean and simple design for a focused reading experience.
          </p>
        </CardContent>
        <CardFooter>
          <Button>Read More</Button>
        </CardFooter>
      </Card>
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Default Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            A clean and simple design for a focused reading experience.
          </p>
        </CardContent>
        <CardFooter>
          <Button>Read More</Button>
        </CardFooter>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Default Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            A clean and simple design for a focused reading experience.
          </p>
        </CardContent>
        <CardFooter>
          <Button>Read More</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
