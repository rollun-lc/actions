import { gql, GraphQLClient } from 'graphql-request';

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

  async syncFromGithub() {
    const query = gql`
      mutation ($targetKey: String!, $handler: String!) {
        storage {
          executeAction(targetKey: $targetKey, handler: $handler) {
            responseResult {
              succeeded
              errorCode
              slug
              message
            }
          }
        }
      }
    `;

    await this.client.request(query, {
      handler: 'sync',
      targetKey: 'git',
    });
  }

  async getPageByName(name) {
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

  async getPageById(id) {
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

  async updatePageWithTags(pageId, tags) {
    const fullPage = await this.getPageById(pageId);
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
      ...fullPage,
      tags,
    });
  }

  async tryDeletePage(name) {
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

      console.log(`Page ${name} deleted`);
    } catch (e) {
      console.log(`Page ${name} not found`);
    }
  }
}
