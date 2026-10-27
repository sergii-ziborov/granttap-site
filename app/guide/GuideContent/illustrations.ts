export const illustrations = {
  workspace: { file: "/guide/illustrations/workspace.webp", title: "Ваш компьютер — под рукой",
    alt: "Скульптурная иллюстрация: телефон и ноутбук связаны бумажной лентой с сообщениями" },
  delivery: { file: "/guide/illustrations/delivery.webp", title: "У каждого сообщения свой путь",
    alt: "Концептуальная иллюстрация: телефон, прозрачный почтовый ящик реле и ноутбук" },
  governance: { file: "/guide/illustrations/governance.webp", title: "Правила, в которых можно разобраться",
    alt: "Концептуальная иллюстрация: зелёные ворота, жетон решения и оранжевая преграда" },
  mesh: { file: "/guide/illustrations/mesh.webp", title: "Связи, которые сохраняют границы",
    alt: "Концептуальная иллюстрация: три отдельных архитектурных острова с мостами между ними" },
};

export type IllustrationId = keyof typeof illustrations;
export const groupIllustration: Record<string, IllustrationId> = {
  start: "workspace", daily: "workspace", messages: "delivery", coordination: "mesh",
  rules: "governance", support: "mesh",
};
