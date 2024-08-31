import allTemplates from "../public/packs/alltemplates.json";

export interface Template {
  id: string;
  title: string;
  body: string;
  slug: string;
  description: string;
  emoji: string;
  name: string;
  format: string;
  uses: number;
}

export interface Pack {
  id: string;
  name: string;
  templates: Template[];
}

export class TemplateParser {
  private packs: Pack[] = [];

  constructor() {
    this.parsePacks();
  }

  private parsePacks() {
    const templates = allTemplates.result.data.json;
    const packMap = new Map<string, Pack>();

    templates.forEach((template: any) => {
      const packId = template.packId;
      if (!packMap.has(packId)) {
        packMap.set(packId, {
          id: packId,
          name:
            template.pack.name ||
            template.title ||
            template.name ||
            "Unnamed Pack",
          templates: [],
        });
      }

      const pack = packMap.get(packId)!;
      pack.templates.push({
        id: template.id,
        title: template.title,
        body: template.body,
        slug: template.slug,
        description: template.description,
        emoji: template.emoji,
        name: template.name,
        format: template.format,
        uses: template.uses,
      });
    });

    this.packs = Array.from(packMap.values());
  }

  getPacks(): Pack[] {
    return this.packs;
  }

  getPackById(packId: string): Pack | undefined {
    return this.packs.find((pack) => pack.id === packId);
  }

  getTemplateById(packId: string, templateId: string): Template | undefined {
    const pack = this.getPackById(packId);
    return pack?.templates.find((template) => template.id === templateId);
  }
}
