import { z } from 'zod';

const identifierSchema = z.uuid();

export const createProductDraftRequestSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().trim().min(1).max(10_000),
    categoryIds: z.array(identifierSchema).min(1).max(20),
    primaryCategoryId: identifierSchema,
  })
  .strict()
  .superRefine((input, context) => {
    if (new Set(input.categoryIds).size !== input.categoryIds.length) {
      context.addIssue({
        code: 'custom',
        message: 'categoryIds must be unique',
        path: ['categoryIds'],
      });
    }
    if (!input.categoryIds.includes(input.primaryCategoryId)) {
      context.addIssue({
        code: 'custom',
        message: 'primaryCategoryId must belong to categoryIds',
        path: ['primaryCategoryId'],
      });
    }
  });

export type CreateProductDraftRequest = z.infer<typeof createProductDraftRequestSchema>;

export const catalogPageQuerySchema = z
  .object({
    cursor: z.string().trim().min(1).max(1_024).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export type CatalogPageQuery = z.infer<typeof catalogPageQuerySchema>;

export const createProductDraftRequestJsonSchema = z.toJSONSchema(
  createProductDraftRequestSchema,
  { target: 'draft-2020-12' },
);
