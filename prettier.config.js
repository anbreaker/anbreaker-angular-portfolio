import prettierPluginCssOrder from 'prettier-plugin-css-order';
import prettierPluginSortJson from 'prettier-plugin-sort-json';

export default {
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  cssDeclarationSorterOrder: 'alphabetical',
  endOfLine: 'auto',
  htmlWhitespaceSensitivity: 'ignore',
  overrides: [
    { files: '*.component.html', options: { parser: 'angular' } },
    { files: '*.ts', options: { parser: 'typescript' } },
    { files: '*.scss', options: { parser: 'scss' } },
  ],
  plugins: [prettierPluginCssOrder, prettierPluginSortJson],
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
};
