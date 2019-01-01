import MVVM from './core/MVVM';
import * as _ from './utils';
import EventEmitter from './lib/EventEmitter';
import { emit } from 'cluster';

window['_'] = _;

window['vm'] = new MVVM({
    el: '#root',
    data() {
        return {
            person: {
                name: '凯瑟琳',
                age: 16
            }
        };
    },
    computed: {
        showAge() {
            if (this.over30) {
                return '秘密 >_<#@!';
            }
            return this.person.age;
        },
        diff30() {
            return 30 - this.person.age;
        },
        over30() {
            return this.person.age >= 30;
        }
    },
    methods: {
        reset() {
            Object.assign(this.$data, this.$options.data());
        }
    }
});
