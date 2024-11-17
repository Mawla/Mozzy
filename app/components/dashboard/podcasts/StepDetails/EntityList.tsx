import { Badge } from "@/components/ui/badge";

interface EntityListProps {
  data: {
    people?: string[];
    organizations?: string[];
    locations?: string[];
  };
}

export const EntityList = ({ data }: EntityListProps) => {
  return (
    <div className="mt-4 space-y-4">
      {data.people && (
        <div>
          <h4 className="font-medium mb-2">People</h4>
          <div className="flex flex-wrap gap-2">
            {data.people.map((person, index) => (
              <Badge key={index} variant="secondary">
                {person}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {data.organizations && (
        <div>
          <h4 className="font-medium mb-2">Organizations</h4>
          <div className="flex flex-wrap gap-2">
            {data.organizations.map((org, index) => (
              <Badge key={index} variant="secondary">
                {org}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {data.locations && (
        <div>
          <h4 className="font-medium mb-2">Locations</h4>
          <div className="flex flex-wrap gap-2">
            {data.locations.map((location, index) => (
              <Badge key={index} variant="secondary">
                {location}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
