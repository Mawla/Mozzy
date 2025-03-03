import allTemplates from "../public/packs/alltemplates.json";
import { Template, Pack } from "@/app/types/template";

export class TemplateParser {
  private packs: Pack[] = [];

  constructor() {
    this.parsePacks();
  }

  private parsePacks() {
    const templates = allTemplates;
    const packMap = new Map<string, Pack>();

    templates.forEach((template: Template) => {
      const packId = template.packId || "default";
      if (!packMap.has(packId)) {
        packMap.set(packId, {
          id: packId,
          name: template.name || "Unnamed Pack",
          templates: [],
          emoji: template.emoji,
        });
      }

      const pack = packMap.get(packId)!;
      pack.templates.push(template);
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
