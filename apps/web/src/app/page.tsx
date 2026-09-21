import { getPreviewCollection } from '../features/storefront-preview/application/get-preview-collection';
import { demoPreviewCollectionSource } from '../features/storefront-preview/infrastructure/demo-preview-collection-source';
import { PreviewHome } from '../features/storefront-preview/presentation/preview-home';

export default async function HomePage() {
  const result = await getPreviewCollection(demoPreviewCollectionSource);

  return <PreviewHome result={result} />;
}
