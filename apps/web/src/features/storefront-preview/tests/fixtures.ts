import type { PreviewCollectionItem } from '../application/preview-collection-source';

export const previewItemsFixture = [
  {
    id: 'concept-01',
    name: 'Vestido Aurora',
    category: 'Vestidos',
    conceptLabel: 'Conceito visual',
    image: {
      src: '/preview/vestido-aurora.png',
      alt: 'Imagem conceitual de moda plus size com vestido fluido',
      width: 1122,
      height: 1402,
    },
  },
  {
    id: 'concept-02',
    name: 'Conjunto Horizonte',
    category: 'Conjuntos',
    conceptLabel: 'Conceito visual',
    image: {
      src: '/preview/conjunto-horizonte.png',
      alt: 'Imagem conceitual de moda plus size com conjunto de alfaiataria',
      width: 1122,
      height: 1402,
    },
  },
  {
    id: 'concept-03',
    name: 'Blusa Essência',
    category: 'Blusas',
    conceptLabel: 'Conceito visual',
    image: {
      src: '/preview/blusa-essencia.png',
      alt: 'Imagem conceitual de moda plus size com blusa de caimento leve',
      width: 1122,
      height: 1402,
    },
  },
  {
    id: 'concept-04',
    name: 'Saia Movimento',
    category: 'Saias',
    conceptLabel: 'Conceito visual',
    image: {
      src: '/preview/saia-movimento.png',
      alt: 'Imagem conceitual de moda plus size com saia em movimento',
      width: 1122,
      height: 1402,
    },
  },
] as const satisfies readonly PreviewCollectionItem[];
