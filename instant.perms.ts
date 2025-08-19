import type { InstantRules } from "@instantdb/react";

const rules = {
  // Allow file uploads and viewing for form submissions
  "$files": {
    "allow": {
      "view": "true",
      "create": "true",
      "delete": "false" // Only allow creation and viewing, not deletion
    }
  },
  // Allow submissions to be created and viewed
  "submissions": {
    "allow": {
      "view": "true", 
      "create": "true",
      "update": "false", // Form submissions shouldn't be modified
      "delete": "false"  // Form submissions shouldn't be deleted
    }
  }
} satisfies InstantRules;

export default rules;
