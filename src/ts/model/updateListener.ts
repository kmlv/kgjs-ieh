/// <reference path="../kg.ts" />

module KG {

    export function randomString(length: number) {
        let text = "KGID_";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    export interface UpdateListenerDefinition {
        model?: Model;
        updatables?: string[];
        constants?: any[];
    }

    export interface IUpdateListener {
        model: Model;
        update: (force: boolean) => UpdateListener;
        hasChanged: boolean;
    }

    export class UpdateListener implements IUpdateListener {

        private updatables: string[];
        public name: string;
        public id: string;
        public def: UpdateListenerDefinition;
        public model: Model;
        public hasChanged: boolean;

        [propName: string]: any;

        constructor(def: UpdateListenerDefinition) {


            def.constants = (def.constants || []).concat(['model', 'updatables', 'name']);
            let ul = this;
            ul.def = def;
            def.constants.forEach(function (c) {
                ul[c] = isNaN(parseFloat(def[c])) ? def[c] : +def[c];
            });
            ul.id = randomString(10);
            ul.model.addUpdateListener(this);
        }

        private updateDef(name: string) {
            let u = this;
            if (u.def.hasOwnProperty(name)) {
                const d = u.def[name],
                    initialValue = u[name];
                let newValue = u.model.eval(d);
                if (initialValue != newValue) {
                    u.hasChanged = true;
                    u[name] = newValue;
                    //console.log(u.constructor['name'],name,'changed from',initialValue,'to',newValue);
                }
            }
            return u;
        }

        update(force: boolean) {
            let u = this;
            u.hasChanged = !!force;
            if (u.hasOwnProperty('updatables') && u.updatables != undefined) {
                u.updatables.forEach(function (name) {
                    u.updateDef(name)
                });
            }
            return u;
        }

    }

}