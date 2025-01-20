import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Button } from "@ui/components/ui/button";

export default function ImageCard() {
  return (
    <Card className="overflow-hidden flex flex-col">
      <img
        src="https://cdn.pixabay.com/photo/2015/10/02/15/00/diary-968592_1280.jpg"
        alt="Blog post image"
        className="w-full h-48 object-contain pt-5"
      />
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Image Card 1</CardTitle>
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
