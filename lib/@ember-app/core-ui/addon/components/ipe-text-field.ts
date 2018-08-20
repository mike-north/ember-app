import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { action } from '@ember-decorators/object';
import KeyboardService from 'ember-keyboard/services/keyboard';
import { service } from '@ember-decorators/service';
import { next } from '@ember/runloop';

export default class IpeTextField extends Component {
  isEditing!: boolean;
  type!: string;
  value!: string;
  onValueChanged?: (evt: { oldVal: string; newVal: string }) => void;
  constructor() {
    super(...arguments);
    this.inputKeyDownListener = this.inputKeyDownListener.bind(this);
  }
  @service
  public keyboard!: KeyboardService;

  focusTextField() {
    const field = this.element.querySelector<HTMLInputElement>(
      '.ipe-editor-field',
    );
    if (!field) throw new Error('no field found');
    field.setSelectionRange(0, field.value.length);
    field.focus();
    field.addEventListener('keydown', this.inputKeyDownListener);
  }
  get editorField(): HTMLInputElement {
    const field = this.element.querySelector<HTMLInputElement>(
      '.ipe-editor-field',
    );
    if (!field) throw new Error('no field found');
    return field;
  }
  inputKeyDownListener(keyEvt: KeyboardEvent) {
    if (keyEvt.keyCode === 13) {
      this.saveEdit(this.editorField);
    } else if (keyEvt.keyCode === 27) {
      this.cancelEdit(this.editorField);
    }
  }
  saveEdit(field: HTMLInputElement) {
    if (this.onValueChanged) {
      this.onValueChanged({ oldVal: this.value, newVal: field.value });
    }
    this.cancelEdit(field);
  }
  cancelEdit(field: HTMLInputElement) {
    field.removeEventListener('keydown', this.inputKeyDownListener);
    this.set('isEditing', false);
  }

  @action
  public onBeginEdit(evt: MouseEvent) {
    evt.preventDefault();
    this.set('isEditing', true);
    next(this, 'focusTextField');
  }

  @action
  public onSaveEdit(evt: MouseEvent) {
    evt.preventDefault();
    this.set('isEditing', false);
  }
  @action
  public onCancelEdit(evt: MouseEvent) {
    evt.preventDefault();
    this.set('isEditing', false);
  }
}

IpeTextField.prototype.type = 'text';
IpeTextField.prototype.tagName = 'span';
IpeTextField.prototype.isEditing = false;
IpeTextField.prototype.layout = hbs`
  {{#if isEditing}}
    <input class='ipe-editor-field' type={{type}} value={{@value}}/>
    <button onClick={{action 'onSaveEdit'}}>Save</button>
    <button onClick={{action 'onCancelEdit'}}>Cancel</button>
  {{else}}
    {{@value}} <a onClick={{action 'onBeginEdit'}}>✏️</a>
  {{/if}}
`;
