import { gql, GraphQLClient } from 'graphql-request';

export type UpdateOrCreatePageOptions = {
  content: string;
  description: string;
  isPrivate: boolean;
  isPublished: boolean;
  locale: string;
  path: string;
  tags: string[];
  title: string;
};

export class WikiJsApi {
  private readonly client: GraphQLClient;

  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string,
  ) {
    this.client = new GraphQLClient(baseUrl, {
      headers: {
        Authorization: 'Bearer ' + apiKey,
      },
    });
  }

  async createPage(page: UpdateOrCreatePageOptions) {
    const createPageQuery = gql`
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

  async getPageByNameSafe(name: string) {
    try {
      return await this.getPageByName(name);
    } catch (e) {
      return null;
    }
  }

  async getPageByName(name: string) {
    const getPagesQuery = gql`
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
    const response = (await this.client.request(getPagesQuery)) as {
      pages: {
        list: {
          id: number;
          path: string;
          tags: string[];
          title: string;
        }[];
      };
    };

    const page = response.pages.list.find((page) => page.path === name);

    if (!page) {
      throw new Error(`Page with name "${name}" not found`);
    }

    return page;
  }

  async getPageById(id: string) {
    const getPageByIdQuery = gql`
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
    })) as {
      pages: {
        single: {
          id: number;
        };
      };
    };

    return response.pages.single;
  }

  async updatePageWithTags(pageId: number, page: UpdateOrCreatePageOptions) {
    const updatePageQuery = gql`
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
      id: pageId,
      ...page,
      editor: 'markdown',
      publishEndDate: '',
      publishStartDate: '',
      scriptCss: '',
      scriptJs: '',
    });
  }

  async tryDeletePage(name: string) {
    try {
      const page = await this.getPageByName(name);

      const deletePageQuery = gql`
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
    } catch (e) {
      // ignore
    }
  }
}
