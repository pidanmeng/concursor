import type { Config } from '../../apps/backend/src/payload-types';
import { getClientSideURL } from '@concursor/utils';

import queryString from 'qs';
import type { DeepPartial } from 'ts-essentials';
import { logger } from '../../apps/extension/src/utils';
import type { BulkOperationResult, Config as ConfigType, PaginatedDocs, Where } from './payloadClientTypes';

export type PayloadApiClientOptions = {
  apiURL: string;
  fetcher?: typeof fetch;
  apiKey?: string;
};

type CreateData<T> = Omit<T, 'id' | 'updatedAt' | 'createdAt'> & {
  updatedAt?: string;
  createdAt?: string;
};

export class PayloadApiClient<C extends ConfigType> {
  private apiURL: string;
  private baseFetcher: typeof fetch;
  private apiKey: string;

  constructor({
    apiURL,
    fetcher = typeof window !== 'undefined' ? window.fetch.bind(window) : fetch,
    apiKey = '',
  }: PayloadApiClientOptions) {
    this.apiKey = apiKey;
    this.baseFetcher = fetcher;
    this.apiURL = apiURL;
  }

  private fetcher(url: RequestInfo | URL, options?: RequestInit) {
    if (this.apiKey) {
      return this.baseFetcher(
        url,
        {
          ...options,
          headers: {
            ...options?.headers,
            'Authorization': `users API-Key ${this.apiKey}`,
          },
        },
      );
    }
    return this.baseFetcher(url, options);
  }

  setBaseUrl(apiURL: string) {
    this.apiURL = apiURL;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async auth<T extends keyof C['collections']>({
    collection,
    ...toQs
  }: {
    collection: T;
  }) {
    const qs = buildQueryString(toQs);
    const response = await this.fetcher(`${this.apiURL}/${collection.toString()}/me${qs}`, {
      method: 'GET',
    });

    return response.json();
  }

  async create<T extends keyof C['collections']>({
    collection,
    data,
    file,
    ...toQs
  }: {
    collection: T;
    data: CreateData<C['collections'][T]>;
    depth?: number;
    draft?: boolean;
    fallbackLocale?: C['locale'];
    file?: File;
    locale?: C['locale'];
  }): Promise<{ doc: C['collections'][T]; message: string }> {
    const qs = buildQueryString(toQs);

    const requestInit: RequestInit = { method: 'POST' };

    if (file) {
      const formData = new FormData();

      formData.set('file', file);
      formData.set('_payload', JSON.stringify(data));

      requestInit.body = formData;
    } else {
      requestInit.headers = {
        'Content-Type': 'application/json',
      };
      requestInit.body = JSON.stringify(data);
    }

    const response = await this.fetcher(
      `${this.apiURL}/${collection.toString()}${qs}`,
      requestInit,
    );

    return response.json();
  }

  async delete<T extends keyof C['collections']>({
    collection,
    ...toQs
  }: {
    collection: T;
    depth?: number;
    draft?: boolean;
    fallbackLocale?: C['locale'];
    locale?: C['locale'];
    where: Where;
  }): Promise<BulkOperationResult<C['collections'][T]>> {
    const qs = buildQueryString(toQs);

    const response = await this.fetcher(`${this.apiURL}/${collection.toString()}${qs}`, {
      method: 'DELETE',
    });

    return response.json();
  }

  async deleteById<T extends keyof C['collections']>({
    collection,
    id,
    ...toQs
  }: {
    collection: T;
    depth?: number;
    draft?: boolean;
    fallbackLocale?: C['locale'];
    id: C['collections'][T]['id'];
    locale?: C['locale'];
  }): Promise<C['collections'][T]> {
    const qs = buildQueryString(toQs);

    const response = await this.fetcher(`${this.apiURL}/${collection.toString()}/${id}${qs}`, {
      method: 'DELETE',
    });

    return response.json();
  }

  async find<T extends keyof C['collections'], K extends (keyof C['collections'][T])[]>({
    collection,
    ...toQs
  }: {
    collection: T;
    depth?: number;
    draft?: boolean;
    fallbackLocale?: C['locale'];
    limit?: number;
    locale?: 'all' | C['locale'];
    page?: number;
    select?: K;
    sort?: `-${Exclude<keyof C['collections'][T], symbol>}` | keyof C['collections'][T];
    where?: Where;
  }): Promise<
    PaginatedDocs<K extends undefined ? C['collections'][T] : Pick<C['collections'][T], K[0]>>
  > {
    const qs = buildQueryString(toQs);
    logger.info('this.apiKey', this.apiKey)
    logger.info('this.apiURL', this.apiURL)
    logger.info('collection', collection)
    logger.info('qs', qs)
    const response = await this.fetcher(`${this.apiURL}/${collection.toString()}${qs}`);

    return response.json();
  }

  async findById<T extends keyof C['collections'], K extends (keyof C['collections'][T])[]>({
    collection,
    id,
    ...toQs
  }: {
    collection: T;
    depth?: number;
    draft?: boolean;
    fallbackLocale?: C['locale'];
    id: C['collections'][T]['id'];
    locale?: 'all' | C['locale'];
    select?: K;
  }): Promise<K extends undefined ? C['collections'][T] : Pick<C['collections'][T], K[0]>> {
    const qs = buildQueryString(toQs);

    const response = await this.fetcher(`${this.apiURL}/${collection.toString()}/${id}${qs}`);

    return response.json();
  }

  async findGlobal<T extends keyof C['globals'], K extends (keyof C['globals'][T])[]>({
    slug,
    ...toQs
  }: {
    depth?: number;
    fallbackLocale?: C['locale'];
    locale?: 'all' | C['locale'];
    select?: K;
    slug: T;
  }): Promise<K extends undefined ? C['globals'][T] : Pick<C['globals'][T], K[0]>> {
    const qs = buildQueryString(toQs);

    const response = await this.fetcher(`${this.apiURL}/globals/${slug.toString()}${qs}`);

    return response.json();
  }

  getApiURL() {
    return this.apiURL;
  }

  getFetcher() {
    return this.fetcher;
  }

  async update<T extends keyof C['collections']>({
    collection,
    data,
    ...toQs
  }: {
    collection: T;
    data: DeepPartial<C['collections'][T]>;
    depth?: number;
    draft?: boolean;
    fallbackLocale?: C['locale'];
    id: C['collections'][T]['id'];
    locale?: C['locale'];
    where: Where;
  }): Promise<BulkOperationResult<C['collections'][T]>> {
    const qs = buildQueryString(toQs);

    const response = await this.fetcher(`${this.apiURL}/${collection.toString()}${qs}`, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });

    return response.json();
  }

  async updateById<T extends keyof C['collections']>({
    collection,
    data,
    file,
    id,
    ...toQs
  }: {
    collection: T;
    data: DeepPartial<C['collections'][T]>;
    depth?: number;
    draft?: boolean;
    fallbackLocale?: C['locale'];
    file?: File;
    id: C['collections'][T]['id'];
    locale?: C['locale'];
  }): Promise<{ doc: C['collections'][T]; message: string }> {
    const qs = buildQueryString(toQs);

    const requestInit: RequestInit = { method: 'PATCH' };

    if (file) {
      const formData = new FormData();

      formData.set('file', file);
      formData.set('_payload', JSON.stringify(data));

      requestInit.body = formData;
    } else {
      requestInit.headers = {
        'Content-Type': 'application/json',
      };
      requestInit.body = JSON.stringify(data);
    }

    const response = await this.fetcher(
      `${this.apiURL}/${collection.toString()}/${id}${qs}`,
      requestInit,
    );

    return response.json();
  }

  async updateGlobal<T extends keyof C['globals']>({
    data,
    slug,
    ...toQs
  }: {
    data: DeepPartial<C['globals'][T]>;
    depth?: number;
    fallbackLocale?: C['locale'];
    locale?: C['locale'];
    slug: T;
  }): Promise<C['globals'][T]> {
    const qs = buildQueryString(toQs);

    const response = await this.fetcher(`${this.apiURL}/globals/${slug.toString()}${qs}`, {
      body: JSON.stringify(data),
      method: 'PATCH',
    });

    return response.json();
  }

  async count<T extends keyof C['collections']>({
    collection,
    ...toQs
  }: {
    collection: T;
  }): Promise<{ totalDocs: number }> {
    const qs = buildQueryString(toQs);

    const response = await this.fetcher(`${this.apiURL}/${collection.toString()}/count${qs}`);

    return response.json();
  }
}

export function buildQueryString(args: Record<string, unknown> | undefined) {
  if (!args) return '';

  if (args['fallbackLocale']) {
    args['fallback-locale'] = args['fallbackLocale'];
    delete args['fallbackLocale'];
  }

  if (args['select']) {
    args['select'] = (args['select'] as string[]).reduce((acc: Record<string, boolean>, field) => {
      acc[field] = true;
      return acc;
    }, {});
  }

  return queryString.stringify(args, { addQueryPrefix: true });
}

let clientInstance: PayloadApiClient<Config> | null = null;

export function getPayload(
  apiURL?: string,
  apiKey?: string,
): PayloadApiClient<Config> {
  if (!clientInstance) {
    clientInstance = new PayloadApiClient<Config>({
      apiURL: `${apiURL || getClientSideURL()}/api`,
      apiKey,
    });
  }
  return clientInstance;
}
