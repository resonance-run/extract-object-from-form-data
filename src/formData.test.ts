import { extractObjectFromFormData } from './formData.js';

describe('extractObjectFromFormData', () => {
  test('simple paths', () => {
    const formData = new FormData();
    formData.set('name', 'Name');
    formData.set('description', 'Description');
    expect(extractObjectFromFormData(formData)).toEqual({
      name: 'Name',
      description: 'Description',
    });
  });

  test('numbers', () => {
    const formData = new FormData();
    formData.set('position', '3');
    expect(extractObjectFromFormData(formData)).toEqual({
      position: 3,
    });
  });

  test('nested paths', () => {
    const formData = new FormData();
    formData.set('meta.name', 'Name');
    formData.set('meta.description', 'Description');
    expect(extractObjectFromFormData(formData)).toEqual({
      meta: {
        name: 'Name',
        description: 'Description',
      },
    });
  });

  test('lists', () => {
    const formData = new FormData();
    formData.set('list[0]', 'Name');
    formData.set('list[1]', 'Description');
    expect(extractObjectFromFormData(formData)).toEqual({
      list: ['Name', 'Description'],
    });
  });

  test('lists with nested objects', () => {
    const formData = new FormData();
    formData.set('list[0].name', 'Name');
    formData.set('list[0].description', 'Description');
    expect(extractObjectFromFormData(formData)).toEqual({
      list: [{ name: 'Name', description: 'Description' }],
    });
  });

  test('deep nesting', () => {
    const formData = new FormData();
    formData.set('variations[0].fields.plan.name', 'plan');
    formData.set('variations[0].fields.plan.type', 'Fields');
    formData.set('variations[0].fields.plan.fields.plan-name.name', 'plan-name');
    formData.set('variations[0].fields.plan.fields.plan-name.type', 'Copy');
    formData.set('variations[0].fields.plan.fields.plan-name.value[0]', 'Basic');
    formData.set('variations[0].fields.plan.fields.description.name', 'description');
    formData.set('variations[0].fields.plan.fields.description.type', 'Copy');
    formData.set('variations[0].fields.plan.fields.description.value[0]', 'Basic features');
    expect(extractObjectFromFormData(formData)).toEqual({
      variations: [
        {
          fields: {
            plan: {
              name: 'plan',
              type: 'Fields',
              fields: {
                'plan-name': {
                  name: 'plan-name',
                  type: 'Copy',
                  value: ['Basic'],
                },
                description: {
                  name: 'description',
                  type: 'Copy',
                  value: ['Basic features'],
                },
              },
            },
          },
        },
      ],
    });
  });

  test('checkboxes, checked', () => {
    const formData = new FormData();
    formData.set('value', 'isChecked');
    formData.set('value.isCheckbox', 'true');
    expect(extractObjectFromFormData(formData)).toEqual({
      value: true,
    });
  });

  test('checkboxes, unchecked', () => {
    const formData = new FormData();
    formData.set('value.isCheckbox', 'true');
    expect(extractObjectFromFormData(formData)).toEqual({
      value: false,
    });
  });

  test('string values', () => {
    const formData = new FormData();
    formData.set('value', '3');
    formData.set('bool', 'isChecked');
    formData.set('bool.isCheckbox', 'true');
    expect(extractObjectFromFormData(formData, { stringValues: true })).toEqual({
      value: '3',
      bool: 'true',
    });
  });
});
