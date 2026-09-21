import type {
  PreviewCollectionResult,
  PreviewCollectionSource,
} from './preview-collection-source';

export async function getPreviewCollection(
  source: PreviewCollectionSource,
): Promise<PreviewCollectionResult> {
  try {
    const items = await source.list();

    return items.length > 0
      ? { status: 'ready', items }
      : { status: 'empty', items: [] };
  } catch {
    return {
      status: 'error',
      message: 'Não foi possível carregar esta prévia agora.',
    };
  }
}
