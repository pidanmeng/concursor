/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
    'admin-users': AdminUserAuthOperations;
  };
  blocks: {};
  collections: {
    rules: Rule;
    tags: Tag;
    packages: Package;
    favorites: Favorite;
    media: Media;
    users: User;
    'admin-users': AdminUser;
    projects: Project;
    forms: Form;
    'form-submissions': FormSubmission;
    'rules-search': RulesSearch;
    'favorites-search': FavoritesSearch;
    'tags-search': TagsSearch;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {
    tags: {
      rules: 'rules';
      packages: 'packages';
    };
    users: {
      createdRules: 'rules';
      favoriteRules: 'favorites';
      createdPackages: 'packages';
    };
    'admin-users': {
      createdRules: 'rules';
    };
  };
  collectionsSelect: {
    rules: RulesSelect<false> | RulesSelect<true>;
    tags: TagsSelect<false> | TagsSelect<true>;
    packages: PackagesSelect<false> | PackagesSelect<true>;
    favorites: FavoritesSelect<false> | FavoritesSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    users: UsersSelect<false> | UsersSelect<true>;
    'admin-users': AdminUsersSelect<false> | AdminUsersSelect<true>;
    projects: ProjectsSelect<false> | ProjectsSelect<true>;
    forms: FormsSelect<false> | FormsSelect<true>;
    'form-submissions': FormSubmissionsSelect<false> | FormSubmissionsSelect<true>;
    'rules-search': RulesSearchSelect<false> | RulesSearchSelect<true>;
    'favorites-search': FavoritesSearchSelect<false> | FavoritesSearchSelect<true>;
    'tags-search': TagsSearchSelect<false> | TagsSearchSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: 'en' | 'zh';
  user:
    | (User & {
        collection: 'users';
      })
    | (AdminUser & {
        collection: 'admin-users';
      });
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
export interface AdminUserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "rules".
 */
export interface Rule {
  id: string;
  private?: boolean | null;
  title: string;
  creator?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'admin-users';
        value: string | AdminUser;
      } | null);
  obsolete?: boolean | null;
  description?: string | null;
  downloadCount?: number | null;
  favoriteCount?: number | null;
  tags?: (string | Tag)[] | null;
  globs?: string | null;
  content: string;
  forkedFrom?: (string | null) | Rule;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  email: string;
  emailVerified?: string | null;
  name: string;
  image?: string | null;
  avatar?: (string | null) | Media;
  personalPage?: string | null;
  createdRules?: {
    docs?: (string | Rule)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  favoriteRules?: {
    docs?: (string | Favorite)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  createdPackages?: {
    docs?: (string | Package)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  accounts?:
    | {
        id?: string | null;
        provider: string;
        providerAccountId: string;
        type: string;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
  enableAPIKey?: boolean | null;
  apiKey?: string | null;
  apiKeyIndex?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    square?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    small?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    medium?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    large?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    xlarge?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    og?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "favorites".
 */
export interface Favorite {
  id: string;
  creator?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'admin-users';
        value: string | AdminUser;
      } | null);
  rule: string | Rule;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "admin-users".
 */
export interface AdminUser {
  id: string;
  name: string;
  avatar?: (string | null) | Media;
  personalPage?: string | null;
  createdRules?: {
    docs?: (string | Rule)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  updatedAt: string;
  createdAt: string;
  enableAPIKey?: boolean | null;
  apiKey?: string | null;
  apiKeyIndex?: string | null;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "packages".
 */
export interface Package {
  id: string;
  creator?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'admin-users';
        value: string | AdminUser;
      } | null);
  name: string;
  description?: string | null;
  rules?: (string | Rule)[] | null;
  private?: boolean | null;
  tags?: (string | Tag)[] | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tags".
 */
export interface Tag {
  id: string;
  name: string;
  rules?: {
    docs?: (string | Rule)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  packages?: {
    docs?: (string | Package)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "projects".
 */
export interface Project {
  id: string;
  creator?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'admin-users';
        value: string | AdminUser;
      } | null);
  obsolete?: boolean | null;
  title: string;
  description?: string | null;
  tags?: (string | Tag)[] | null;
  rules?:
    | {
        rule?: (string | null) | Rule;
        alias?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "forms".
 */
export interface Form {
  id: string;
  title: string;
  fields?:
    | (
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            defaultValue?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'checkbox';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'country';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'email';
          }
        | {
            message?: {
              root: {
                type: string;
                children: {
                  type: string;
                  version: number;
                  [k: string]: unknown;
                }[];
                direction: ('ltr' | 'rtl') | null;
                format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
                indent: number;
                version: number;
              };
              [k: string]: unknown;
            } | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'message';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'number';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: string | null;
            options?:
              | {
                  label: string;
                  value: string;
                  id?: string | null;
                }[]
              | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'select';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'state';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: string | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'text';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: string | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'textarea';
          }
      )[]
    | null;
  submitButtonLabel?: string | null;
  /**
   * Choose whether to display an on-page message or redirect to a different page after they submit the form.
   */
  confirmationType?: ('message' | 'redirect') | null;
  confirmationMessage?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  redirect?: {
    url: string;
  };
  /**
   * Send custom emails when the form submits. Use comma separated lists to send the same email to multiple recipients. To reference a value from this form, wrap that field's name with double curly brackets, i.e. {{firstName}}. You can use a wildcard {{*}} to output all data and {{*:table}} to format it as an HTML table in the email.
   */
  emails?:
    | {
        emailTo?: string | null;
        cc?: string | null;
        bcc?: string | null;
        replyTo?: string | null;
        emailFrom?: string | null;
        subject: string;
        /**
         * Enter the message that should be sent in this email.
         */
        message?: {
          root: {
            type: string;
            children: {
              type: string;
              version: number;
              [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
          };
          [k: string]: unknown;
        } | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "form-submissions".
 */
export interface FormSubmission {
  id: string;
  form: string | Form;
  submissionData?:
    | {
        field: string;
        value: string;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This is a collection of automatically created search results. These results are used by the global site search and will be updated automatically as documents in the CMS are created or updated.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "rules-search".
 */
export interface RulesSearch {
  id: string;
  title?: string | null;
  priority?: number | null;
  doc: {
    relationTo: 'rules';
    value: string | Rule;
  };
  creator?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'admin-users';
        value: string | AdminUser;
      } | null);
  obsolete?: boolean | null;
  description?: string | null;
  downloadCount?: number | null;
  favoriteCount?: number | null;
  tags?: (string | Tag)[] | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This is a collection of automatically created search results. These results are used by the global site search and will be updated automatically as documents in the CMS are created or updated.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "favorites-search".
 */
export interface FavoritesSearch {
  id: string;
  title?: string | null;
  priority?: number | null;
  doc: {
    relationTo: 'favorites';
    value: string | Favorite;
  };
  creator?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'admin-users';
        value: string | AdminUser;
      } | null);
  rule: string | Rule;
  updatedAt: string;
  createdAt: string;
}
/**
 * This is a collection of automatically created search results. These results are used by the global site search and will be updated automatically as documents in the CMS are created or updated.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tags-search".
 */
export interface TagsSearch {
  id: string;
  title?: string | null;
  priority?: number | null;
  doc: {
    relationTo: 'tags';
    value: string | Tag;
  };
  name: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'rules';
        value: string | Rule;
      } | null)
    | ({
        relationTo: 'tags';
        value: string | Tag;
      } | null)
    | ({
        relationTo: 'packages';
        value: string | Package;
      } | null)
    | ({
        relationTo: 'favorites';
        value: string | Favorite;
      } | null)
    | ({
        relationTo: 'media';
        value: string | Media;
      } | null)
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'admin-users';
        value: string | AdminUser;
      } | null)
    | ({
        relationTo: 'projects';
        value: string | Project;
      } | null)
    | ({
        relationTo: 'forms';
        value: string | Form;
      } | null)
    | ({
        relationTo: 'form-submissions';
        value: string | FormSubmission;
      } | null)
    | ({
        relationTo: 'rules-search';
        value: string | RulesSearch;
      } | null)
    | ({
        relationTo: 'favorites-search';
        value: string | FavoritesSearch;
      } | null)
    | ({
        relationTo: 'tags-search';
        value: string | TagsSearch;
      } | null);
  globalSlug?: string | null;
  user:
    | {
        relationTo: 'users';
        value: string | User;
      }
    | {
        relationTo: 'admin-users';
        value: string | AdminUser;
      };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user:
    | {
        relationTo: 'users';
        value: string | User;
      }
    | {
        relationTo: 'admin-users';
        value: string | AdminUser;
      };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "rules_select".
 */
export interface RulesSelect<T extends boolean = true> {
  private?: T;
  title?: T;
  creator?: T;
  obsolete?: T;
  description?: T;
  downloadCount?: T;
  favoriteCount?: T;
  tags?: T;
  globs?: T;
  content?: T;
  forkedFrom?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tags_select".
 */
export interface TagsSelect<T extends boolean = true> {
  name?: T;
  rules?: T;
  packages?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "packages_select".
 */
export interface PackagesSelect<T extends boolean = true> {
  creator?: T;
  name?: T;
  description?: T;
  rules?: T;
  private?: T;
  tags?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "favorites_select".
 */
export interface FavoritesSelect<T extends boolean = true> {
  creator?: T;
  rule?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  alt?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
  sizes?:
    | T
    | {
        thumbnail?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        square?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        small?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        medium?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        large?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        xlarge?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        og?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
      };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  id?: T;
  email?: T;
  emailVerified?: T;
  name?: T;
  image?: T;
  avatar?: T;
  personalPage?: T;
  createdRules?: T;
  favoriteRules?: T;
  createdPackages?: T;
  accounts?:
    | T
    | {
        id?: T;
        provider?: T;
        providerAccountId?: T;
        type?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  enableAPIKey?: T;
  apiKey?: T;
  apiKeyIndex?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "admin-users_select".
 */
export interface AdminUsersSelect<T extends boolean = true> {
  name?: T;
  avatar?: T;
  personalPage?: T;
  createdRules?: T;
  updatedAt?: T;
  createdAt?: T;
  enableAPIKey?: T;
  apiKey?: T;
  apiKeyIndex?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "projects_select".
 */
export interface ProjectsSelect<T extends boolean = true> {
  creator?: T;
  obsolete?: T;
  title?: T;
  description?: T;
  tags?: T;
  rules?:
    | T
    | {
        rule?: T;
        alias?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "forms_select".
 */
export interface FormsSelect<T extends boolean = true> {
  title?: T;
  fields?:
    | T
    | {
        checkbox?:
          | T
          | {
              name?: T;
              label?: T;
              width?: T;
              required?: T;
              defaultValue?: T;
              id?: T;
              blockName?: T;
            };
        country?:
          | T
          | {
              name?: T;
              label?: T;
              width?: T;
              required?: T;
              id?: T;
              blockName?: T;
            };
        email?:
          | T
          | {
              name?: T;
              label?: T;
              width?: T;
              required?: T;
              id?: T;
              blockName?: T;
            };
        message?:
          | T
          | {
              message?: T;
              id?: T;
              blockName?: T;
            };
        number?:
          | T
          | {
              name?: T;
              label?: T;
              width?: T;
              defaultValue?: T;
              required?: T;
              id?: T;
              blockName?: T;
            };
        select?:
          | T
          | {
              name?: T;
              label?: T;
              width?: T;
              defaultValue?: T;
              options?:
                | T
                | {
                    label?: T;
                    value?: T;
                    id?: T;
                  };
              required?: T;
              id?: T;
              blockName?: T;
            };
        state?:
          | T
          | {
              name?: T;
              label?: T;
              width?: T;
              required?: T;
              id?: T;
              blockName?: T;
            };
        text?:
          | T
          | {
              name?: T;
              label?: T;
              width?: T;
              defaultValue?: T;
              required?: T;
              id?: T;
              blockName?: T;
            };
        textarea?:
          | T
          | {
              name?: T;
              label?: T;
              width?: T;
              defaultValue?: T;
              required?: T;
              id?: T;
              blockName?: T;
            };
      };
  submitButtonLabel?: T;
  confirmationType?: T;
  confirmationMessage?: T;
  redirect?:
    | T
    | {
        url?: T;
      };
  emails?:
    | T
    | {
        emailTo?: T;
        cc?: T;
        bcc?: T;
        replyTo?: T;
        emailFrom?: T;
        subject?: T;
        message?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "form-submissions_select".
 */
export interface FormSubmissionsSelect<T extends boolean = true> {
  form?: T;
  submissionData?:
    | T
    | {
        field?: T;
        value?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "rules-search_select".
 */
export interface RulesSearchSelect<T extends boolean = true> {
  title?: T;
  priority?: T;
  doc?: T;
  creator?: T;
  obsolete?: T;
  description?: T;
  downloadCount?: T;
  favoriteCount?: T;
  tags?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "favorites-search_select".
 */
export interface FavoritesSearchSelect<T extends boolean = true> {
  title?: T;
  priority?: T;
  doc?: T;
  creator?: T;
  rule?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tags-search_select".
 */
export interface TagsSearchSelect<T extends boolean = true> {
  title?: T;
  priority?: T;
  doc?: T;
  name?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}