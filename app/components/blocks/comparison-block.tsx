import { ContainerBlock } from "./container-block";

interface ComparisonViewProps {
  title: string;
  leftTitle: string;
  rightTitle: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  description?: string;
  className?: string;
}

export function ComparisonView({
  title,
  leftTitle,
  rightTitle,
  leftContent,
  rightContent,
  description,
  className,
}: ComparisonViewProps) {
  return (
    <ContainerBlock
      title={title}
      description={description}
      className={className}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium mb-2">{leftTitle}</h3>
          {leftContent}
        </div>
        <div>
          <h3 className="font-medium mb-2">{rightTitle}</h3>
          {rightContent}
        </div>
      </div>
    </ContainerBlock>
  );
}
