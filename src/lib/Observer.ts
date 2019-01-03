import Watcher from './Watcher';
import * as _ from '../utils';

/**
 * 需要重写的方法，用于观察数组
 */
const hookArrayMethods: string[] = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];

/**
 * 观察者类，用于观察数据变动
 *
 * @export
 * @class Observer
 */
export default class Observer {

    private keys: string[];

    private data: Object;

    private watcher: Watcher;

    /**
     * Creates an instance of Observer.
     * @param {Object} data 需要观察的对象
     * @param {Watcher} watcher Watcher 对象
     * @param {string[]} [keys=[]] 从root对象到该对象的key的list
     * @memberof Observe
     */
    constructor(data: Object, watcher: Watcher, keys: string[] = []) {

        this.data = data;
        this.watcher = watcher;
        this.keys = keys;

        // 如果是对象则可以hook各个属性的setter
        if (_.getType(data) === 'object') {
            this.observe();
        }
    }



    private observe(): void {
        const data = this.data;

        Object.keys(data).forEach(key => {
            // 先监听这个属性的变更
            this.defineReactive(key);

            // 如果这个属性对应的项是个数组，添加hook
            this.appendArrayHooks(key);

            // 递归
            new Observer(data[key], this.watcher, [...this.keys, key]);
        });
    }

    private defineReactive(key: string): void {

        let val = this.data[key];

        Object.defineProperty(this.data, key, {
            enumerable: true,
            configurable: true,

            get() {
                return val;
            },

            set: newVal => {
                if (val === newVal) {
                    return;
                }

                val = newVal;

                this.watcher.updateKey([...this.keys, key].join('.'));
                // set 的时候需要主动再次添加 observer
                new Observer(val, this.watcher, [...this.keys, key]);
            }
        });
    }

    private appendArrayHooks(key: string) {
        const item = this.data[key];
        if (_.getType(item) !== 'array') {
            return;
        }

        for (let method of hookArrayMethods) {
            Object.defineProperty(item, method, {
                enumerable: false,
                configurable: true,
                get: () => {
                    return (...args: any[]) => {
                        // 得到结果，缓存下来在最后返回
                        const list = this.data[key].slice();
                        const result = list[method](...args);

                        // 把新数组赋值给当前key，触发 watcher 的 update
                        this.data[key] = list;

                        // 再把新数组的 method 给 hook 住
                        this.appendArrayHooks(key);

                        return result;
                    };
                }
            });
        }
    }

}
