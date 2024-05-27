import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { RollupOptions } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import packageJson from './package.json' /*assert { type: 'json' }*/;

const dependencyPkgName = "svelte";
const dependencyVersion = packageJson.dependencies[dependencyPkgName];

/**
 * @param format Either 'module' or 'system'.
 * @param target Either 'es5' or 'es2015'
 * @returns 
 */
function createConfig(format: 'module' | 'system', target: 'es2022', minify: boolean): RollupOptions {
    const configDir = (format === "module" ? "esm" : format) + "/" + target;
    const plugins = [
        resolve({
            // We want the src/main/main-client.js file which is under the "browser" export condition.
            browser: true,
            exportConditions: [target],
        }),
        commonjs()
    ];
    if (minify) {
        plugins.push(terser());
    }
    const banner = `/**
 * ${packageJson.name}@${packageJson.version} is a "${format}" format for ${dependencyPkgName}@${dependencyVersion}
 * © 2023-2024 ${packageJson.author}
 * Released under the ${packageJson.license} License.
 */
`.trim();

    return {
        input: {
            // The key, "name", is used to generate the output file folder and file name in conjunction with entryFileNames.
            // The value is the path to the source code.
            "index": "./src/svelte.js",
            "animate/index": "./src/svelte-animate.js",
            "compiler/index": "./src/svelte-compiler.js",
            "easing/index": "./src/svelte-easing.js",
            "internal/index": "./src/svelte-internal.js",
            "internal/client/index": "./src/svelte-internal-client.js",
            "internal/disclose-version/index": "./src/svelte-internal-disclose-version.js",
            "internal/server/index": "./src/svelte-internal-server.js",
            "legacy/index": "./src/svelte-legacy.js",
            "motion/index": "./src/svelte-motion.js",
            "reactivity/index": "./src/svelte-reactivity.js",
            "server/index": "./src/svelte-server.js",
            "store/index": "./src/svelte-store.js",
            "transition/index": "./src/svelte-transition.js"
        },
        output: [
            {
                // Placing the output in a "dist" folder makes it easier to clean up, but is also a bit less elegant to consume.
                dir: `${configDir}`,
                entryFileNames: `[name]${minify ? ".min" : ""}.js`,
                chunkFileNames: `shared${minify ? ".min" : ""}.js`,
                format,
                // sourcemap: true,
                banner,
            }
        ],
        plugins
    };
}

export default [
    createConfig("module", "es2022", false),
    createConfig("system", "es2022", false),
    createConfig("module", "es2022", true),
    createConfig("system", "es2022", true),
];