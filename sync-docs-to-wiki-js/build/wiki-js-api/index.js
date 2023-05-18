"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikiJsApi = void 0;
const graphql_request_1 = require("graphql-request");
class WikiJsApi {
    apiKey;
    baseUrl;
    client;
    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.client = new graphql_request_1.GraphQLClient(baseUrl, {
            headers: {
                Authorization: 'Bearer ' + apiKey,
            },
        });
    }
    async createPage(page) {
        const createPageQuery = (0, graphql_request_1.gql) `
      mutation (
        $content: String!
        $description: String!
        $editor: String!
        $isPrivate: Boolean!
        $isPublished: Boolean!
        $locale: String!
        $path: String!
        $publishEndDate: Date
        $publishStartDate: Date
        $scriptCss: String
        $scriptJs: String
        $tags: [String]!
        $title: String!
      ) {
        pages {
          create(
            content: $content
            description: $description
            editor: $editor
            isPrivate: $isPrivate
            isPublished: $isPublished
            locale: $locale
            path: $path
            publishEndDate: $publishEndDate
            publishStartDate: $publishStartDate
            scriptCss: $scriptCss
            scriptJs: $scriptJs
            tags: $tags
            title: $title
          ) {
            responseResult {
              succeeded
              errorCode
              slug
              message
              __typename
            }
            page {
              id
              updatedAt
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `;
        await this.client.request(createPageQuery, {
            ...page,
            editor: 'markdown',
            publishEndDate: '',
            publishStartDate: '',
            scriptCss: '',
            scriptJs: '',
        });
    }
    async getPageByNameSafe(name) {
        try {
            return await this.getPageByName(name);
        }
        catch (e) {
            return null;
        }
    }
    async getPageByName(name) {
        const getPagesQuery = (0, graphql_request_1.gql) `
      {
        pages {
          list {
            id
            path
            tags
            title
          }
        }
      }
    `;
        const response = (await this.client.request(getPagesQuery));
        const page = response.pages.list.find((page) => page.path === name);
        if (!page) {
            throw new Error(`Page with name "${name}" not found`);
        }
        return page;
    }
    async getPageById(id) {
        const getPageByIdQuery = (0, graphql_request_1.gql) `
      query ($id: Int!) {
        pages {
          single(id: $id) {
            id
            content
            description
            editor
            isPrivate
            isPublished
            locale
            path
            publishEndDate
            publishStartDate
            scriptCss
            scriptJs
            title
            __typename
          }
          __typename
        }
      }
    `;
        const response = (await this.client.request(getPageByIdQuery, {
            id,
        }));
        return response.pages.single;
    }
    async updatePageWithTags(pageId, page) {
        const updatePageQuery = (0, graphql_request_1.gql) `
      mutation (
        $id: Int!
        $content: String
        $description: String
        $editor: String
        $isPrivate: Boolean
        $isPublished: Boolean
        $locale: String
        $path: String
        $publishEndDate: Date
        $publishStartDate: Date
        $scriptCss: String
        $scriptJs: String
        $tags: [String]
        $title: String
      ) {
        pages {
          update(
            id: $id
            content: $content
            description: $description
            editor: $editor
            isPrivate: $isPrivate
            isPublished: $isPublished
            locale: $locale
            path: $path
            publishEndDate: $publishEndDate
            publishStartDate: $publishStartDate
            scriptCss: $scriptCss
            scriptJs: $scriptJs
            tags: $tags
            title: $title
          ) {
            responseResult {
              succeeded
              errorCode
              slug
              message
              __typename
            }
            page {
              updatedAt
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `;
        await this.client.request(updatePageQuery, {
            ...page,
            editor: 'markdown',
            publishEndDate: '',
            publishStartDate: '',
            scriptCss: '',
            scriptJs: '',
        });
    }
    async tryDeletePage(name) {
        try {
            const page = await this.getPageByName(name);
            const deletePageQuery = (0, graphql_request_1.gql) `
        mutation ($id: Int!) {
          pages {
            delete(id: $id) {
              responseResult {
                succeeded
                errorCode
                slug
                message
                __typename
              }
              __typename
            }
            __typename
          }
        }
      `;
            await this.client.request(deletePageQuery, {
                id: page.id,
            });
        }
        catch (e) {
            // ignore
        }
    }
}
exports.WikiJsApi = WikiJsApi;
