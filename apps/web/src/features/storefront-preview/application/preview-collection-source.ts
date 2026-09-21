export type PreviewCollectionItem = Readonly<{
  id: string;
  name: string;
  category: string;
  conceptLabel: 'Conceito visual';
  image: Readonly<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }>;
}>;

export interface PreviewCollectionSource {
  list(): Promise<readonly PreviewCollectionItem[]>;
}

export type PreviewCollectionResult =
  | { status: 'ready'; items: readonly PreviewCollectionItem[] }
  | { status: 'empty'; items: readonly [] }
  | { status: 'error'; message: string };
