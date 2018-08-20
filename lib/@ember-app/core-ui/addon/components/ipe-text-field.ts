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

  public doubleClick(evt: MouseEvent) {
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

IpeTextField.prototype.classNames = ['ipe-editor-text-field'];
IpeTextField.prototype.type = 'text';
IpeTextField.prototype.tagName = 'span';
IpeTextField.prototype.isEditing = false;
IpeTextField.prototype.layout = hbs`
  {{#if isEditing}}
    <input class='ipe-editor-field' type={{type}} value={{@value}}/>
    <button onClick={{action 'onSaveEdit'}}>Save</button>
    <button onClick={{action 'onCancelEdit'}}>Cancel</button>
  {{else}}
    {{@value}}
    <span class='edit-indicator'>
      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          width="16px" height="16px" viewBox="0 0 528.899 528.899"
          xml:space="preserve">
      <g>
        <path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981
          c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611
          C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069
          L27.473,390.597L0.3,512.69z"/>
      </g>
      </svg>
    </span>
  {{/if}}
`;
