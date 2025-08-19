import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    // Built-in $files entity for file storage
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    // Built-in $users entity
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    // Our form submissions entity
    submissions: i.entity({
      timestamp: i.string().indexed(),
      purchaseLocation: i.string().indexed(),
      npsScore: i.number().indexed(),
      feedbackDetail: i.string(),
      skinConcern: i.string().indexed(),
      emailAddress: i.string().indexed(),
      joinedLoyalty: i.boolean().indexed(),
      beforeUrl: i.string().optional(),
      afterUrl: i.string().optional(),
      createdAt: i.number().indexed(),
    }),
  },
  links: {},
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
