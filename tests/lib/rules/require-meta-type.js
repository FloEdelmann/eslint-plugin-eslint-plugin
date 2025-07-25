/**
 * @fileoverview require rules to implement a `meta.type` property
 * @author 唯然<weiran.zsd@outlook.com>
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import rule from '../../../lib/rules/require-meta-type.js';
import { RuleTester } from 'eslint';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  languageOptions: { sourceType: 'commonjs' },
});
ruleTester.run('require-meta-type', rule, {
  valid: [
    `
      module.exports = {
        meta: { type: 'problem' },
        create(context) {}
      };
    `,
    {
      // ESM
      code: `
        export default {
          meta: { type: 'problem' },
          create(context) {}
        };
      `,
      languageOptions: { sourceType: 'module' },
    },
    `
      module.exports = {
        meta: { type: 'suggestion' },
        create(context) {}
      };
    `,
    `
      module.exports = {
        meta: { type: 'layout' },
        create(context) {}
      };
    `,
    `
      const type = 'problem';
      module.exports = {
        meta: { type },
        create(context) {}
      };
    `,
    `
      module.exports = {
        meta: { type: getType() },
        create(context) {}
      };
    `,
    `
      module.exports = {
        meta: { type: FOO },
        create(context) {}
      };
    `,
    {
      code: `
        const create = {};
        module.exports = {
          meta: {},
          create,
        };
      `,
      errors: [{ messageId: 'missing' }],
    },
    // Spread.
    `
      const extra = { type: 'problem' };
      module.exports = {
        meta: { ...extra },
        create(context) {}
      };
    `,
    'module.exports = {};', // No rule.
  ],

  invalid: [
    {
      code: `
        module.exports = {
          meta: {},
          create(context) {}
        };
      `,
      errors: [{ messageId: 'missing', type: 'ObjectExpression' }],
    },
    {
      // No `meta`. Violation on `create`.
      code: 'module.exports = { create(context) {} };',
      errors: [{ messageId: 'missing', type: 'FunctionExpression' }],
    },
    {
      // `meta` in variable, missing `type`.
      code: 'const meta = {}; module.exports = { meta, create(context) {} };',
      errors: [{ messageId: 'missing', type: 'ObjectExpression' }],
    },
    {
      // ESM
      code: `
        export default {
          meta: {},
          create(context) {}
        };
      `,
      languageOptions: { sourceType: 'module' },
      errors: [{ messageId: 'missing', type: 'ObjectExpression' }],
    },
    {
      code: `
        function create(context) {}
        module.exports = {
          meta: {},
          create,
        };
      `,
      errors: [{ messageId: 'missing', type: 'ObjectExpression' }],
    },
    {
      code: `
        const create = function(context) {};
        module.exports = {
          meta: {},
          create,
        };
      `,
      errors: [{ messageId: 'missing', type: 'ObjectExpression' }],
    },
    {
      code: `
        const create = (context) => {};
        module.exports = {
          meta: {},
          create,
        };
      `,
      errors: [{ messageId: 'missing', type: 'ObjectExpression' }],
    },
    {
      code: `
        module.exports = {
          meta: { type: 'invalid-type' },
          create(context) {}
        };
      `,
      errors: [{ messageId: 'unexpected', type: 'Literal' }],
    },
    {
      code: `
        const type = 'invalid-type';
        module.exports = {
          meta: { type },
          create(context) {}
        };
      `,
      errors: [{ messageId: 'unexpected', type: 'Identifier' }],
    },
    {
      code: `
        module.exports = {
          meta: { type: null },
          create(context) {}
        };
      `,
      errors: [{ messageId: 'unexpected', type: 'Literal' }],
    },
    {
      code: `
        module.exports = {
          meta: { type: undefined },
          create(context) {}
        };
      `,
      errors: [{ messageId: 'unexpected', type: 'Identifier' }],
    },
  ],
});
