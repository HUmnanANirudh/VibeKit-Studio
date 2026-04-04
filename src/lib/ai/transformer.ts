export function reconstructRecord(arr: { key: string, value: any }[]) {
  const obj: any = {};
  for (const p of arr) obj[p.key] = p.value;
  return obj;
}

export function transformAssistantUpdate(update: any) {
  const reconstructBlocks = (blocks: any[]) => blocks.map(b => ({
    type: b.type,
    props: reconstructRecord(b.props)
  }));

  const themeObj: any = {};
  if (update.theme) {
    for (const group of update.theme) {
      themeObj[group.category] = reconstructRecord(group.tokens);
    }
  }

  const reconstructedZones: any = {};
  if (update.zones) {
    for (const z of update.zones) {
      reconstructedZones[z.zoneId] = reconstructBlocks(z.blocks);
    }
  }

  return {
    themeTokens: themeObj,
    content: {
      blocks: reconstructBlocks(update.blocks || []),
      zones: reconstructedZones,
    },
    interactions: update.interactions,
    sectionOrder: [],
  };
}
