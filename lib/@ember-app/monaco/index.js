/* jshint node: true */
'use strict';

const mergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const Ts = require('broccoli-typescript-compiler').default;
const esTranspiler = require('broccoli-babel-transpiler');
const stew = require('broccoli-stew');
const concat = require('broccoli-concat');

let environment;

const EDITOR_SCRIPTS_TS_CONFIG = {
  compilerOptions: {
    module: 'es2015',
    target: 'es2017',
    moduleResolution: 'node',
    inlineSourceMap: true,
    inlineSources: true,
    declaration: true
  },
  include: ['**/*']
};

const EDITOR_SCRIPTS_BABEL_CONFIG = {
  browserPolyfill: true,
  moduleIds: true,
  sourceMaps: 'inline',
  plugins: ["transform-es2015-modules-amd", "syntax-dynamic-import"],
  presets: [
    [
      'env',
      {
        targets: {
          browsers: ['last 2 versions']
        }
      }
    ]
  ]
};

const DEBUG = true;
function maybeDebug(tree, name) {
  if (DEBUG) return stew.debug(tree, { name });
  else return tree;
}

module.exports = {
  name: '@ember-app/monaco',
  isDevelopingAddon: function() {
    return true;
  },
  included: function(parent) {
    parent.options.fingerprint = parent.options.fingerprint || {};
    parent.options.fingerprint.exclude =
      parent.options.fingerprint.exclude || [];
    // the monaco-editor loader doesn't work with fingerprinted assets (yet),
    // so we exclude it.
    parent.options.fingerprint.exclude.push('monaco/vs');

    // TODO: disable uglify for CSS and JS to speed up the build and:
    // [WARN] `ember-monaco-editor/vs/editor/editor.main.js` took: 87370ms (more than 20,000ms)
    parent.import('node_modules/penpal/lib/index.js', {
      using: [
        { transformation: 'cjs', as: 'penpal'}
      ]
    });
    // TODO: consider lazy-loading the loader using the LoaderService
    // parent.import('vendor/ember-monaco-editor/vs/loader.js');
    // parent.import('vendor/ember-monaco-editor/vs/editor/editor.main');
  },
  config: function(env /*, appConfig*/) {
    environment = env;
  },
  treeForEditor: function() {
    let src = maybeDebug(
      new Funnel('lib/@ember-app/monaco/editor', {
        destDir: 'editor-scripts'
      }),
      '1-es-src'
    );
    const regeneratorTree = maybeDebug(
      new Funnel('node_modules/regenerator-runtime/runtime.js', {
        destDir: './regenerator.js'
      }),
      '1.1-regenerator-src'
    );
    // const penpalTree = maybeDebug(
    //   new rollup(
    //     maybeDebug(new Funnel('node_modules/penpal/lib/index.js', {
    //       destDir: 'penpal.js'
    //     }), '1.2-penpal-src'),
    //     {
    //       rollup: {
    //         input: './penpal.js',
    //         output: {file: 'penpal.iife.js', format: 'iife'},
    //       }
    //     }
    //   ), '1.2.1-penpal-src-rollup'
    // );

    let es7Tree = maybeDebug(
      new Ts(src, {
        tsconfig: EDITOR_SCRIPTS_TS_CONFIG,
        throwOnError: false,
        annotation: 'compile program'
      }),
      '2-es-typescript'
    );

    // let es7Tree2 = maybeDebug(mergeTrees([es7Tree, src]), {
    //   name: '2.1-es-typescript-w-src'
    // });

    const es5Tree = maybeDebug(
      esTranspiler(mergeTrees([es7Tree]), EDITOR_SCRIPTS_BABEL_CONFIG), '3-es-babel'
    );

    const es5TreeWithDeps = maybeDebug(mergeTrees([regeneratorTree, es5Tree]),'4-es-withdeps');

    const finalMerge = maybeDebug(mergeTrees([es5TreeWithDeps]), '5-es-finalMerge');

    // const typeDeclarations = stew.find(finalMerge, { include: ['*.d.ts'] });
    const finalScript = maybeDebug(
      concat(finalMerge, {
        header: '(function() {',
        footer: '}());',
        headerFiles: ['regenerator.js'],
        inputFiles: ['**/*.js'],
        outputFile: 'ember-app-editor/frame.js'
      }),
      '6-es-concatScript'
    );
    return mergeTrees([
      finalScript,
      new Funnel('lib/@ember-app/monaco/editor/frame.html', {
        destDir: 'ember-app-editor/frame.html'
      }),
    ]);
  },
  treeForPublic: function() {
    var publicTree = this._super.treeForPublic.apply(this, arguments);
    return mergeTrees(
      [
        new Funnel(this._getMonacoEditorModulePath(), {
          destDir: 'ember-app-editor/vs'
        }),
        publicTree,
        this.treeForEditor()
      ].filter(Boolean)
    );
  },
  // treeForVendor: function () {
  //   // TODO: remove this if we lazy-load
  //   var vendorTree = this._super.treeForPublic.apply(this, arguments);
  //   return debug(mergeTrees([new Funnel(this._getMonacoEditorModulePath(), {
  //       destDir: 'ember-monaco-editor/vs',
  //       // include: ['loader.js*']
  //   }), vendorTree]), {name: 'my-app-name'});
  // },

  _getMonacoEditorModulePath: function() {
    var monacoEditorModulePath = 'node_modules/monaco-editor';
    return environment !== 'production'
      ? monacoEditorModulePath + '/dev/vs'
      : monacoEditorModulePath + '/min/vs';
  }
};
