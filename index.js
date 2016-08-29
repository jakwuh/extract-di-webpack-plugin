import generate from 'babel-core/lib/generation';
import {extend} from 'lodash';
import vm from 'vm';
import {name as packageName} from './package.json';

const TYPES = {
    MemberExpression: 'MemberExpression',
    Identifier: 'Identifier',
    Literal: 'Literal'
};

export default class ExtractDIPlugin {

    /**
     * Usage:
     * ```
     *   // module.js
     *   Object.defineProperty(exports, <exportName>, definitions);
     *
     *   // entry.js
     *   const definitions = require(<moduleName>);
     * ```
     *
     * @param {string} [moduleName]
     * @param {string} [exportName]
     */
    constructor(moduleName = 'di-definitions', {exportName = '__diDefinitions'} = {}) {
        this.definitions = {};
        this.moduleName = moduleName;
        this.exportName = exportName;
    }

    apply(compiler) {
        const self = this;

        compiler.options.resolve.alias[this.moduleName] = `${packageName}/noop.js`;

        compiler.parser.plugin('call Object.defineProperty', function (ast) {
            const args = ast.arguments;
            let object, property;

            switch (args[0].type) {
                case TYPES.MemberExpression:
                    object = `${args[0].object.name}.${args[0].property.name}`;
                    break;
                case TYPES.Identifier:
                    object = args[0].name;
                    break;
            }

            if (args[1].type === TYPES.Literal) {
                property = args[1].value;
            }

            if (['module.exports', 'exports'].indexOf(object) !== -1 && property === self.exportName) {
                extend(self.definitions, self.parseObjectAST(args[2]));
            }

            return true;
        });

        compiler.plugin('compilation', compilation => {

            compilation.plugin('seal', () => {

                const module = compilation.modules.find(module => module.rawRequest === self.moduleName);

                if (module) {
                    module._source._value = `module.exports = ${JSON.stringify(self.definitions)};`;

                    module.parser.parse(module._source.source(), {
                        current: module,
                        module: module,
                        compilation: compilation,
                        options: compilation.options
                    });
                }

            });
        })
    }

    parseObjectAST(ast) {
        const descriptor = {};
        const script = new vm.Script(`value = ${generate(ast).code}`);
        const context = new vm.createContext(descriptor);
        script.runInContext(context);
        return descriptor.value.value;
    }

}
