import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Button } from "@ui/components/ui/button";

export default function ImageCard() {
  return (
    <Card className="overflow-hidden">
      <img
        src="https://cdn.pixabay.com/photo/2015/10/02/15/00/diary-968592_1280.jpg"
        alt="Blog post image"
        className="w-full h-48 object-contain"
      />
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Image Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Highlighting visual content for image-heavy blog posts.</p>
      </CardContent>
      <CardFooter>
        <Button>Read Full Article</Button>
      </CardFooter>
    </Card>
  );
}
