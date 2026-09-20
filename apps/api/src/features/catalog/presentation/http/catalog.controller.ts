import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  catalogIdentifierSchema,
  catalogPageQuerySchema,
  createProductDraftRequestJsonSchema,
  createProductDraftRequestSchema,
} from '../catalog.schemas';
import { CatalogHttpExceptionFilter } from './catalog-http-exception.filter';
import {
  CATALOG_HTTP_SERVICE,
  CATALOG_IDENTITY,
  type CatalogHttpService,
  type CatalogIdentity,
} from './catalog-http.tokens';
import { CorrelationIdInterceptor } from './correlation-id.interceptor';

@ApiTags('catalog')
@Controller('v1')
@UseFilters(CatalogHttpExceptionFilter)
@UseInterceptors(CorrelationIdInterceptor)
export class CatalogController {
  constructor(
    @Inject(CATALOG_IDENTITY)
    private readonly identity: CatalogIdentity,
    @Inject(CATALOG_HTTP_SERVICE)
    private readonly service: CatalogHttpService,
  ) {}

  @Post('admin/catalog/products')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a catalog product draft' })
  @ApiBody({ schema: createProductDraftRequestJsonSchema as never })
  @ApiResponse({ status: 201, description: 'Draft created' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Insufficient permission' })
  @ApiResponse({ status: 409, description: 'Catalog conflict' })
  @ApiResponse({ status: 422, description: 'Request validation failed' })
  @ApiResponse({ status: 503, description: 'Catalog dependency unavailable' })
  async createProductDraft(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: unknown,
  ) {
    const actor = await this.identity.authenticate(authorization);
    const input = createProductDraftRequestSchema.parse(body);
    return this.service.createDraft(actor, input);
  }

  @Post('admin/catalog/products/:productId/activate')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate a complete catalog product' })
  @ApiParam({ name: 'productId', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Product activated' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Insufficient permission' })
  @ApiResponse({ status: 404, description: 'Catalog product not found' })
  @ApiResponse({ status: 409, description: 'Catalog conflict' })
  @ApiResponse({ status: 422, description: 'Request validation failed' })
  @ApiResponse({ status: 503, description: 'Catalog dependency unavailable' })
  async activateProduct(
    @Headers('authorization') authorization: string | undefined,
    @Param('productId') productId: string,
  ) {
    const validatedProductId = catalogIdentifierSchema.parse(productId);
    const actor = await this.identity.authenticate(authorization);
    return this.service.activate(actor, validatedProductId);
  }

  @Post('admin/catalog/products/:productId/archive')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive a catalog product' })
  @ApiParam({ name: 'productId', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Product archived' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Insufficient permission' })
  @ApiResponse({ status: 404, description: 'Catalog product not found' })
  @ApiResponse({ status: 422, description: 'Request validation failed' })
  @ApiResponse({ status: 503, description: 'Catalog dependency unavailable' })
  async archiveProduct(
    @Headers('authorization') authorization: string | undefined,
    @Param('productId') productId: string,
  ) {
    const validatedProductId = catalogIdentifierSchema.parse(productId);
    const actor = await this.identity.authenticate(authorization);
    return this.service.archive(actor, validatedProductId);
  }

  @Get('catalog/products')
  @ApiOperation({ summary: 'List active catalog products' })
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
  })
  @ApiQuery({ name: 'cursor', required: false, schema: { type: 'string' } })
  @ApiResponse({ status: 200, description: 'Active catalog page' })
  @ApiResponse({ status: 422, description: 'Request validation failed' })
  @ApiResponse({ status: 503, description: 'Catalog dependency unavailable' })
  listPublicProducts(@Query() query: unknown) {
    return this.service.listPublic(catalogPageQuerySchema.parse(query));
  }
}
