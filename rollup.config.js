import { uglify } from 'rollup-plugin-uglify';
import fileSize from 'rollup-plugin-filesize';
import license from 'rollup-plugin-license';
import replace from "rollup-plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import buble from '@rollup/plugin-buble';
import resolve from "rollup-plugin-node-resolve";
import typescript from '@rollup/plugin-typescript';

import PACKAGE from './package.json';
const fullYear = new Date().getFullYear();

const banner = `${PACKAGE.name} - ${PACKAGE.version}
  Author : ${PACKAGE.author}
  Copyright (c) ${(fullYear!== 2016 ? '2016,' : '')} ${fullYear} to ${PACKAGE.author}, released under the ${PACKAGE.license} license.
  ${PACKAGE.repository.url}`;

const globals = {
  react: 'React'
};

const defaultConfig = {
  input: 'src/number_format.tsx',
  output: [{
    file: 'dist/react-number-format.es.js',
    format: 'esm',
    globals,
    exports: 'default',
  }, {
    file: 'dist/react-number-format.cjs.js',
    format: 'cjs',
    globals,
    exports: 'default',
  }, {
    file: 'dist/react-number-format.js',
    format: 'umd',
    name: 'NumberFormat',
    globals,
    exports: 'default',
  }],
  external: ['react'],
  plugins: [
    typescript({
      target: 'es2016'
    }),
    buble({
      objectAssign: true,
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    resolve(),
    commonjs({
      include: /node_modules/
    }),
    fileSize(),
    license({
      banner
    }),
  ],
};

const minConfig = {
  ...defaultConfig,
  output: {
    file: 'dist/react-number-format.min.js',
    format: 'umd',
    name: 'NumberFormat',
    globals,
    exports: 'default',
  },
  plugins: [
    ...defaultConfig.plugins,
    uglify(),
  ],
};

export default [defaultConfig, minConfig];
