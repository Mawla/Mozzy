import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionProps {
  id: string;
  title: string;
  content: string;
  listTitle?: string;
  listItems?: string[];
  qa?: Array<{ question: string; answer: string }>;
  children?: React.ReactNode;
}

export function Section({
  id,
  title,
  content,
  listTitle,
  listItems,
  qa,
  children,
}: SectionProps) {
  return (
    <section id={id} className="mt-8">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        {title}
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
      {listTitle && listItems && (
        <>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            {listTitle}
          </h3>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            {listItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
      {qa && (
        <>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            Q&A
          </h3>
          {qa.map((item, index) => (
            <Card key={index} className="mt-4">
              <CardHeader>
                <CardTitle>{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </>
      )}
      {children}
    </section>
  );
}
