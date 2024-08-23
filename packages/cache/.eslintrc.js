/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
	root: true,
	extends: ["neon/common", "neon/node", "neon/typescript"],
	parserOptions: { project: "tsconfig.eslint.json" },
	ignorePatterns: ["**/dist/*"],
};
