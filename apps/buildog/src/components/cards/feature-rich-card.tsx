import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Badge } from "@ui/components/ui/badge";
import { Button } from "@ui/components/ui/button";
import { HeartFilledIcon, CalendarIcon } from "@ui/components/react-icons";
export default function FeatureRichCard() {
  return (
    <Card className="bg-gray-100 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Feature-rich Card</CardTitle>
        <Badge className="w-12">New</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">Packed with features for an engaging blog post preview.</p>
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>May 20, 2023</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button>Read More</Button>
        <Button variant="ghost">
          <HeartFilledIcon className="mr-2 h-4 w-4" />
          Like
        </Button>
      </CardFooter>
    </Card>
  );
}
