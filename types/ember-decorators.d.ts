import hbs from "htmlbars-inline-precompile";

declare module '@ember-decorators/object' {
  export const action: MethodDecorator;
  export function computed(...dependentKeys: string[]): PropertyDecorator;
  // export function computed(target: any, propertyKey: string | symbol): void;
  export const observes: (...propsToObserve: string[]) => PropertyDecorator;
  // TODO readonly
}

declare module '@ember-decorators/component' {
  // NOTE: @attribute currently doesn't work
  export function attribute(target: any, propertyKey: string | symbol): void;
  export function attribute(attrName: string): PropertyDecorator;
  export function className(
    whenTrue: string,
    whenFalse: string
  ): PropertyDecorator;
  export function className(target: any, propertyKey: string | symbol): void;
  export function classNames(...classes: string[]): ClassDecorator;
  export function tagName(tag: string): ClassDecorator;
  export function layout(tmpl: ReturnType<typeof hbs>): ClassDecorator;
}

declare module '@ember-decorators/service' {
  export const service: PropertyDecorator;
}

declare module '@ember-decorators/data' {
  export function attr(target: any, propertyKey: string | symbol): void;
  export function attr(type: string, options?: any): PropertyDecorator;
  export function belongsTo(target: any, propertyKey: string | symbol): void;
  export function belongsTo(
    recordType: string,
    options?: any
  ): PropertyDecorator;
  export function hasMany(target: any, propertyKey: string | symbol): void;
  export function hasMany(recordType: string, options?: any): PropertyDecorator;
}

declare module '@ember-decorators/controller' {
  // export controller attr: ServiceDecorator;
  // export const hasMany: ServiceDecorator;
  // export const belongsTo: ServiceDecorator;
}

// import { controller } from '@ember-decorators/controller';

// import { alias, or, reads } from '@ember-decorators/object/computed';

// import { on } from '@ember-decorators/object/evented';import ComputedProperty from '@ember/object/computed';
