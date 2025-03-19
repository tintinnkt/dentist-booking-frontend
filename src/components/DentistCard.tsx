import { AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";
import { DentistListAllItem } from "../types/api/Dentist";

import { ButtonConfigKeys } from "./CustomButton";
import { Accordion, AccordionItem } from "./ui/Accordion";
import { Badge } from "./ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface DentistCardProps {
  dentist: DentistListAllItem;
  onAction?: () => void;
  isLoaded?: boolean;
  actionButtonUseFor?: ButtonConfigKeys;
}

const DentistCard = ({
  dentist,
  isLoaded = true,
  onAction,
  actionButtonUseFor,
}: DentistCardProps) => {
  // const { data: session } = useSession();
  // const user = session?.user;

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-4">
          <h2>{dentist.name}</h2>
          <Badge variant={"secondary"}>
            {dentist.yearsOfExperience} year of experience
          </Badge>
        </CardTitle>
        <CardContent className="w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="see-full-detail">
              <AccordionTrigger className="w-full text-start">
                Full Description
              </AccordionTrigger>
              <AccordionContent className="grid w-full grid-cols-5">
                <p className="col-span-1">name</p>
                <p className="col-span-4">{dentist.name}</p>
                <p className="col-span-1">year of experience</p>
                <p className="col-span-4">{dentist.yearsOfExperience}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default DentistCard;
