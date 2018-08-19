/* jshint node: true */
'use strict';

const mergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const Ts = require('broccoli-typescript-compiler').default;
const stew = require('broccoli-stew');
const concat = require('broccoli-concat');
const rollup = require('broccoli-rollup');
const rollupNodeResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const rollupBabel = require('rollup-plugin-babel');

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
  sourceMaps: 'inline',
  runtimeHelpers: true,
  presets: [
    [
      'env',
      {
        modules: false,
        targets: {
          browsers: ['last 2 versions']
        }
      }
    ]
  ]
};

const DEBUG = process.env.BROCCOLI_DEBUG;
function maybeDebug(tree, name) {
  // if (DEBUG) return stew.debug(tree, { name });
  // else
  return tree;
}

module.exports = {
  name: '@ember-app/code-editor',
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
      new Funnel('lib/@ember-app/code-editor/editor', {
        destDir: 'editor-scripts'
      }),
      '1-es-src'
    );
    let es7Tree = maybeDebug(
      new Ts(src, {
        tsconfig: EDITOR_SCRIPTS_TS_CONFIG,
        throwOnError: false,
        annotation: 'compile program'
      }),
      '2-es-typescript'
    );
    const frameBundleTree = maybeDebug(new rollup(es7Tree, {
      rollup: {
        input: './editor-scripts/index.js',
        output: {
          file: 'frame-bundle.js',
          format: 'iife',
        },
        plugins: [
          rollupNodeResolve({
            jsnext: true,
            main: true
          }),
          rollupCommonjs(),
          rollupBabel(EDITOR_SCRIPTS_BABEL_CONFIG),
        ]
      }
    }), '3-es-rollup');

    const regeneratorTree = maybeDebug(
      new Funnel('node_modules/regenerator-runtime/runtime.js', {
        destDir: './regenerator.js'
      }),
      '1.1-regenerator-src'
    );


    const finalScript = maybeDebug(
      new concat(
        mergeTrees([frameBundleTree, regeneratorTree]), {
          headerFiles: ['regenerator.js'],
          inputFiles: ['**/*'],
          outputFile: 'ember-app/code-editor/frame.js'
        }
      ),
      '9-finalScript'
    );

    return maybeDebug(
      mergeTrees([
        finalScript
      ]),
      '999-out'
    );
  },
  treeForPublic: function() {
    var publicTree = this._super.treeForPublic.apply(this, arguments);
    return maybeDebug(mergeTrees(
      [
        new Funnel(this._getMonacoEditorModulePath(), {
          destDir: 'ember-app/code-editor/vs'
        }),
        new Funnel('lib/@ember-app/code-editor/editor/frame.html', {
          destDir: 'ember-app/code-editor/frame.html'
        }),
        publicTree,
        this.treeForEditor()
      ].filter(Boolean)
    ), 'x-public');
  },

  postprocessTree: function (type, appTree) {
    if (type !== 'all') {
      return appTree;
    }
    return mergeTrees(
      [
        appTree
      ].filter(Boolean)
    );
  },

  _getMonacoEditorModulePath: function() {
    var monacoEditorModulePath = 'node_modules/monaco-editor';
    return environment !== 'production'
      ? monacoEditorModulePath + '/dev/vs'
      : monacoEditorModulePath + '/min/vs';
  }
};
